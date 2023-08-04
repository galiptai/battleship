import { useEffect, useState } from "react";
import { Client, Message } from "stompjs";
import { getId, getLastUsedName } from "../../logic/identification";
import { BoardSetup } from "../setup/BoardSetup";
import { Board } from "../../logic/Board";
import { BoardData } from "../../logic/GameSave";

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
  const [gameState, setGameState] = useState<GameState>("JOINING");

  useEffect(() => {
    const gameSub = stompClient.subscribe(`/game/${gameId}/`, onGameUpdateReceived, {
      userId: getId(),
    });
    const userSub = stompClient.subscribe(`/user/${getId()}/game`, onUserSpecificUpdateReceived);

    return () => {
      gameSub.unsubscribe();
      userSub.unsubscribe();
    };
  }, [stompClient, gameId]);

  function onGameUpdateReceived(message: Message) {
    const update = JSON.parse(message.body) as AllUpdates;
    switch (update.type) {
      case "STATE_CHANGE":
        setGameState(update.gameState);
        return;
    }
  }

  function sendPlayerBoard(board: Board) {
    stompClient.send(`/app/game/${gameId}/setBoard`, { userId: getId() });
  }

  function onUserSpecificUpdateReceived() {
    return;
  }

  switch (gameState) {
    case "JOINING":
      return <div>Waiting for another player to join</div>;
    case "SETUP":
      return <BoardSetup setVerifiedBoard={sendPlayerBoard} starterName={getLastUsedName()} />;
    case "P1_TURN":
    case "P2_TURN":
    case "OVER":
  }
}
