import { useCallback, useEffect, useState } from "react";
import { Client, Message, Subscription } from "stompjs";
import { getId } from "../../logic/identification";
import { OnlineSetup } from "./OnlineSetup";
import { OnlinePlay } from "./OnlinePlay";
import { OnlineGame as Game, GameData, GameState, WhichPlayer } from "../../logic/OnlineGame";

type StateUpdate = {
  gameState: GameState;
};

type WinnerUpdate = {
  winner: WhichPlayer;
};

type OnlineGameSubscriptions = {
  gameStateSub: Subscription | null;
  winSub: Subscription | null;
};

type OnlineGameProps = {
  stompClient: Client;
  gameId: string;
};

export function OnlineGame({ stompClient, gameId }: OnlineGameProps) {
  const [game, setGame] = useState<Game | null>(null);

  const onWinUpdateReceived = useCallback((message: Message) => {
    const winnerUpdate = JSON.parse(message.body) as WinnerUpdate;
    setGame((game) => {
      const newGame = game!.makeCopy();
      newGame.winner = winnerUpdate.winner;
      newGame.gameState = "OVER";
      return newGame;
    });
  }, []);

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
    return;
  }, []);

  const fetchGameAndJoin = useCallback(
    async (signal: AbortSignal, subscriptions: OnlineGameSubscriptions) => {
      try {
        const res = await fetch(`api/v1/game/${gameId}?playerId=${getId()}`, { signal });
        if (res.ok) {
          const gameData = (await res.json()) as GameData;
          setGame(Game.fromGameData(gameData));
          subscriptions.gameStateSub = stompClient.subscribe(
            `/game/${gameId}/state`,
            onGameStateUpdateReceived,
            {
              userId: getId(),
            }
          );
          subscriptions.winSub = stompClient.subscribe(
            `/game/${gameId}/winner`,
            onWinUpdateReceived
          );
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
    [gameId, stompClient, onGameStateUpdateReceived, onWinUpdateReceived]
  );

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const subscriptions: OnlineGameSubscriptions = { gameStateSub: null, winSub: null };
    void fetchGameAndJoin(signal, subscriptions);

    return () => {
      controller.abort();
      const { gameStateSub, winSub } = subscriptions;
      gameStateSub?.unsubscribe();
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
    case "P2_TURN": {
      const isPlayersTurn: boolean =
        (game.gameState === "P1_TURN" && game.playerIs === "PLAYER1") ||
        (game.gameState === "P2_TURN" && game.playerIs === "PLAYER2");
      if (game.player && game.opponent) {
        return (
          <OnlinePlay
            stompClient={stompClient}
            game={game}
            setGame={setGame}
            isPlayersTurn={isPlayersTurn}
          />
        );
      } else {
        return <div>Loading...</div>;
      }
    }
    case "OVER":
      if (game.winner) {
        return <div>{game.getWinnerName()} won!</div>;
      }
      return <div>Game is over.</div>;
    case "SUSPENDED":
      return <div>Game is suspended.</div>;
  }
}
