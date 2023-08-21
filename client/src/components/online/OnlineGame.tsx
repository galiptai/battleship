import { useCallback, useEffect, useState } from "react";
import { Client, Message, Subscription } from "stompjs";
import { getId } from "../../logic/identification";
import { OnlineSetup } from "./OnlineSetup";
import { ErrorMessage } from "./Connection";
import { BoardData } from "../../logic/GameSave";
import { OnlinePlay } from "./OnlinePlay";
import { OnlineGame as Game, GameData, GameState } from "../../logic/OnlineGame";

type GameMessageType = "ERROR" | "STATE_CHANGE" | "OPPONENT_BOARD";

type StateUpdate = {
  gameState: GameState;
};

type OnlineGameSubscriptions = {
  gameSub: Subscription | null;
  userSub: Subscription | null;
};

type OnlineGameProps = {
  stompClient: Client;
  gameId: string;
};

export function OnlineGame({ stompClient, gameId }: OnlineGameProps) {
  const [game, setGame] = useState<Game | null>(null);

  const onGameUpdateReceived = useCallback((message: Message) => {
    const type = (message.headers as { type?: GameMessageType })?.type;
    if (!type) {
      console.error("Server error: no type header.");
    }
    switch (type) {
      case "ERROR": {
        const error = JSON.parse(message.body) as ErrorMessage;
        console.error(error.message);
        return;
      }
      case "STATE_CHANGE": {
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
      }
      case "OPPONENT_BOARD": {
        const opponentBoard = JSON.parse(message.body) as BoardData;
        setGame((game) => {
          if (!game) {
            throw Error("Game is not set!");
          }
          const newGame = game.makeCopy();
          newGame.opponent = BoardData.fromJSON(opponentBoard).getBoard();
          return newGame;
        });
        return;
      }
    }
  }, []);

  const fetchGameAndJoin = useCallback(
    async (signal: AbortSignal, subscriptions: OnlineGameSubscriptions) => {
      try {
        const res = await fetch(`api/v1/game/${gameId}?playerId=${getId()}`, { signal });
        if (res.ok) {
          const gameData = (await res.json()) as GameData;
          setGame(Game.fromGameData(gameData));
          subscriptions.userSub = stompClient.subscribe(
            `/user/${getId()}/game`,
            onGameUpdateReceived
          );
          subscriptions.gameSub = stompClient.subscribe(`/game/${gameId}/`, onGameUpdateReceived, {
            userId: getId(),
          });
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
    [gameId, stompClient, onGameUpdateReceived]
  );

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const subscriptions: OnlineGameSubscriptions = { gameSub: null, userSub: null };
    void fetchGameAndJoin(signal, subscriptions);

    return () => {
      controller.abort();
      const { userSub, gameSub } = subscriptions;
      userSub?.unsubscribe();
      gameSub?.unsubscribe();
    };
  }, [stompClient, gameId, fetchGameAndJoin]);

  if (!game) {
    return <div>Joining...</div>;
  }

  switch (game.gameState) {
    case "JOINING":
      return <div>Waiting for another player to join</div>;
    case "SETUP":
      return <OnlineSetup game={game} setGame={setGame} />;
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
      return <div>Game is over.</div>;
    case "SUSPENDED":
      return <div>Game is suspended.</div>;
  }
}
