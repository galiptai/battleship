import { useCallback, useEffect, useState } from "react";
import { Client, Message, Subscription } from "stompjs";
import { getId } from "../../logic/identification";
import { OnlineSetup } from "./OnlineSetup";
import { OnlinePlay } from "./OnlinePlay";
import { OnlineGame as Game, GameData, GameState, WhichPlayer } from "../../logic/OnlineGame";
import { OnlineOver } from "./OnlineOver";
import { BoardData } from "../../logic/GameSave";

type StateUpdate = {
  gameState: GameState;
  message: string | null;
};

type WinnerUpdate = {
  winner: WhichPlayer;
  message: string | null;
};

type OnlineGameSubscriptions = {
  gameStateSub: Subscription | null;
  oppDataSub: Subscription | null;
  winSub: Subscription | null;
};

type OnlineGameProps = {
  stompClient: Client;
  gameId: string;
};

export function OnlineGame({ stompClient, gameId }: OnlineGameProps) {
  const [game, setGame] = useState<Game | null>(null);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  const onGameStateUpdateReceived = useCallback((message: Message) => {
    const stateUpdate = JSON.parse(message.body) as StateUpdate;
    setGame((game) => {
      if (!game) {
        throw Error("Game is not set!");
      }
      const newGame = game.makeCopy();
      newGame.gameState = stateUpdate.gameState;
      return newGame;
    });
    setUpdateMessage(stateUpdate.message);
  }, []);

  const onOppDataReceived = useCallback((message: Message) => {
    const opponentBoard = JSON.parse(message.body) as BoardData;
    setGame((game) => {
      if (!game) {
        throw Error("Game is not set!");
      }
      const newGame = game.makeCopy();
      newGame.setOpponent(BoardData.fromJSON(opponentBoard).getBoard());
      return newGame;
    });
    return;
  }, []);

  const onWinUpdateReceived = useCallback((message: Message) => {
    const winnerUpdate = JSON.parse(message.body) as WinnerUpdate;
    setGame((game) => {
      const newGame = game!.makeCopy();
      newGame.winner = winnerUpdate.winner;
      newGame.gameState = "OVER";
      return newGame;
    });
    setUpdateMessage(winnerUpdate.message);
  }, []);

  const startSubscriptions = useCallback(
    (subscriptions: OnlineGameSubscriptions) => {
      subscriptions.gameStateSub = stompClient.subscribe(
        `/game/${gameId}/state`,
        onGameStateUpdateReceived
      );
      subscriptions.oppDataSub = stompClient.subscribe(
        `/user/${getId()}/game/setup`,
        onOppDataReceived
      );
      subscriptions.winSub = stompClient.subscribe(`/game/${gameId}/winner`, onWinUpdateReceived);
    },
    [gameId, stompClient, onGameStateUpdateReceived, onOppDataReceived, onWinUpdateReceived]
  );

  const fetchGameAndJoin = useCallback(
    async (signal: AbortSignal, subscriptions: OnlineGameSubscriptions) => {
      try {
        const res = await fetch(`api/v1/game/${gameId}?playerId=${getId()}`, { signal });
        if (res.ok) {
          const gameData = (await res.json()) as GameData;
          setGame(Game.fromGameData(gameData));
          startSubscriptions(subscriptions);
        } else {
          const data = (await res.json()) as { detail?: string };
          if (data.detail) {
            console.error(data.detail);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    [gameId, startSubscriptions]
  );

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const subscriptions: OnlineGameSubscriptions = {
      gameStateSub: null,
      oppDataSub: null,
      winSub: null,
    };
    void fetchGameAndJoin(signal, subscriptions);

    return () => {
      controller.abort();
      const { gameStateSub, oppDataSub, winSub } = subscriptions;
      gameStateSub?.unsubscribe();
      oppDataSub?.unsubscribe();
      winSub?.unsubscribe();
    };
  }, [stompClient, gameId, fetchGameAndJoin]);

  if (!game) {
    return <div>Joining...</div>;
  }

  switch (game.gameState) {
    case "JOINING":
      return <div>Waiting for another player to join</div>;
    case "SETUP":
      return <OnlineSetup stompClient={stompClient} game={game} setGame={setGame} />;
    case "P1_TURN":
    case "P2_TURN":
    case "SUSPENDED": {
      if (game.player && game.opponent) {
        return (
          <OnlinePlay
            stompClient={stompClient}
            game={game}
            setGame={setGame}
            updateMessage={updateMessage}
          />
        );
      } else {
        return <div>Loading...</div>;
      }
    }
    case "OVER":
      return (
        <OnlineOver
          stompClient={stompClient}
          game={game}
          setGame={setGame}
          updateMessage={updateMessage}
        />
      );
  }
}
