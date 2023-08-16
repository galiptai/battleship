import { useCallback, useEffect, useState } from "react";
import { Client, Message, Subscription } from "stompjs";
import { getId } from "../../logic/identification";
import { Board } from "../../logic/Board";
import { OnlineSetup } from "./OnlineSetup";

type OnlineGameTypes = {
  stompClient: Client;
  gameId: string;
};

type GameState = "JOINING" | "SETUP" | "P1_TURN" | "P2_TURN" | "OVER";

type UpdateType = "STATE_CHANGE";

type Update = {
  type: UpdateType;
};

type AllUpdates = StateUpdate;

type StateUpdate = {
  gameState: GameState;
} & Update;

export function OnlineGame({ stompClient, gameId }: OnlineGameTypes) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerBoard, setPlayerBoard] = useState<Board | null>(null);

  const onGameUpdateReceived = useCallback((message: Message) => {
    const update = JSON.parse(message.body) as AllUpdates;
    switch (update.type) {
      case "STATE_CHANGE":
        setGameState(update.gameState);
        return;
    }
  }, []);

  useEffect(() => {
    let gameSub: Subscription;
    let userSub: Subscription;
    const timer = setTimeout(() => {
      gameSub = stompClient.subscribe(`/game/${gameId}/`, onGameUpdateReceived, {
        userId: getId(),
      });
      userSub = stompClient.subscribe(`/user/${getId()}/game`, onGameUpdateReceived);
    }, 200);

    return () => {
      clearTimeout(timer);
      gameSub?.unsubscribe();
      userSub?.unsubscribe();
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
