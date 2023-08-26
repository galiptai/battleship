import { useCallback, useEffect, useState } from "react";
import { Client, Message, Subscription } from "stompjs";
import { getId } from "../../logic/storageFunctions";
import { OnlineSetup } from "./OnlineSetup";
import { OnlinePlay } from "./OnlinePlay";
import { OnlineGame as Game, GameData, GameState, WhichPlayer } from "../../logic/OnlineGame";
import { OnlineOver } from "./OnlineOver";
import { BoardData } from "../../logic/GameSave";
import { MessageOverlay } from "../general/MessageOverlay";
import { Loading } from "../general/Loading";
import { CustomError, isErrorMessage } from "../../logic/CustomError";

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
  displayError: (error: unknown) => void;
};

export function OnlineGame({ stompClient, gameId, displayError }: OnlineGameProps) {
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
          const error = (await res.json()) as unknown;
          if (isErrorMessage(error)) {
            const { type, statusCode, userMessage, errorMessage } = error;
            throw new CustomError(type, statusCode, userMessage, errorMessage);
          } else {
            throw error;
          }
        }
      } catch (error: unknown) {
        if ((error as Error)?.name === "AbortError") {
          return;
        }
        displayError(error);
      }
    },
    [gameId, startSubscriptions, displayError]
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
    return <MessageOverlay display message="Joining" description={<Loading />} />;
  }

  switch (game.gameState) {
    case "JOINING":
      return <MessageOverlay display message="Waiting for another player to join" />;
    case "SETUP":
      return (
        <OnlineSetup
          stompClient={stompClient}
          game={game}
          setGame={setGame}
          displayError={displayError}
        />
      );
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
            displayError={displayError}
          />
        );
      } else {
        return <MessageOverlay display message="Loading" description={<Loading />} />;
      }
    }
    case "OVER":
      return (
        <OnlineOver
          stompClient={stompClient}
          game={game}
          setGame={setGame}
          updateMessage={updateMessage}
          displayError={displayError}
        />
      );
  }
}
