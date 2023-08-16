import { useCallback, useEffect, useState } from "react";
import { Client, Message, Subscription } from "stompjs";
import { getId } from "../../logic/identification";
import { Board } from "../../logic/Board";
import { OnlineSetup } from "./OnlineSetup";
import { ErrorMessage } from "./Connection";

type OnlineGameTypes = {
  stompClient: Client;
  gameId: string;
};

type GameState = "JOINING" | "SETUP" | "P1_TURN" | "P2_TURN" | "OVER";

type GameMessageType = "ERROR" | "STATE_CHANGE";

type StateUpdate = {
  gameState: GameState;
};

export function OnlineGame({ stompClient, gameId }: OnlineGameTypes) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerBoard, setPlayerBoard] = useState<Board | null>(null);

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
    }
  }, []);

  useEffect(() => {
    let userSub: Subscription;
    let gameSub: Subscription;
    const timer = setTimeout(() => {
      userSub = stompClient.subscribe(`/user/${getId()}/game`, onGameUpdateReceived);
      gameSub = stompClient.subscribe(`/game/${gameId}/`, onGameUpdateReceived, {
        userId: getId(),
      });
    }, 200);

    return () => {
      clearTimeout(timer);
      userSub?.unsubscribe();
      gameSub?.unsubscribe();
    };
  }, [stompClient, gameId, onGameUpdateReceived]);

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
    case "OVER":
  }
}
