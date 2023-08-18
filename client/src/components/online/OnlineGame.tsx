import { useCallback, useEffect, useState } from "react";
import { Client, Message, Subscription } from "stompjs";
import { getId } from "../../logic/identification";
import { Board } from "../../logic/Board";
import { OnlineSetup } from "./OnlineSetup";
import { ErrorMessage } from "./Connection";
import { Guess } from "../../logic/gameLogic";
import { BoardData, PlainBoardData } from "../../logic/GameSave";

type GameState = "JOINING" | "SETUP" | "P1_TURN" | "P2_TURN" | "OVER" | "SUSPENDED";

type GameMessageType = "ERROR" | "STATE_CHANGE" | "OPPONENT_BOARD";

type GameData = {
  id: string;
  isP1: boolean;
  player: PlainBoardData | null;
  opponent: PlainBoardData | null;
  guesses: Guess[];
  gameState: GameState;
};

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
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerIsP1, setPlayerIsP1] = useState<boolean>(false);
  const [playerBoard, setPlayerBoard] = useState<Board | null>(null);
  const [opponentBoard, setOpponentBoard] = useState<Board | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);

  const setGame = (data: GameData) => {
    console.log(data);
    setPlayerIsP1(data.isP1);
    setPlayerBoard(data.player ? BoardData.fromJSON(data.player).getBoard() : null);
    setOpponentBoard(data.opponent ? BoardData.fromJSON(data.opponent).getBoard() : null);
    setGuesses(data.guesses);
    setGameState(data.gameState);
  };

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
        setGameState(stateUpdate.gameState);
        return;
      }
      case "OPPONENT_BOARD": {
        const opponentBoard = JSON.parse(message.body) as BoardData;
        if (opponentBoard) {
          setOpponentBoard(BoardData.fromJSON(opponentBoard).getBoard());
        }
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
          setGame(gameData);
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

  switch (gameState) {
    case null:
      return <div>Joining game...</div>;
    case "JOINING":
      return <div>Waiting for another player to join</div>;
    case "SETUP":
      return (
        <OnlineSetup gameId={gameId} playerBoard={playerBoard} setPlayerBoard={setPlayerBoard} />
      );
    case "P1_TURN":
    case "P2_TURN":
      return (
        <div>
          {(gameState === "P1_TURN" && playerIsP1) || (gameState === "P2_TURN" && !playerIsP1)
            ? "Its your turn"
            : "Its not your turn"}
        </div>
      );
    case "OVER":
    case "SUSPENDED":
      return <div>Game is suspended.</div>;
  }
}
