import { Client, Message } from "stompjs";
import { Board } from "../../logic/Board";
import { BoardData } from "../../logic/GameSave";
import { OnlineGame } from "../../logic/OnlineGame";
import { getId, getLastUsedName } from "../../logic/identification";
import { BoardSetup } from "../setup/BoardSetup";
import { useCallback, useEffect, useState } from "react";

type OnlineSetupProps = {
  stompClient: Client;
  game: OnlineGame;
  setGame: React.Dispatch<React.SetStateAction<OnlineGame | null>>;
};

export function OnlineSetup({ stompClient, game, setGame }: OnlineSetupProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);

  const onSetupReceived = useCallback(
    (message: Message) => {
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
    },
    [setGame]
  );

  useEffect(() => {
    const setupSub = stompClient.subscribe(`/user/${getId()}/game/setup`, onSetupReceived);

    return () => {
      setupSub.unsubscribe();
    };
  }, [stompClient, onSetupReceived]);

  async function sendPlayerBoard(board: Board) {
    setSubmitting(true);
    try {
      const res = await fetch(`api/v1/game/${game.id}/setBoard?playerId=${getId()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(BoardData.getDataFromBoard(board)),
      });
      if (res.ok) {
        setGame((game) => {
          const newGame = game!.makeCopy();
          newGame.player = board;
          return newGame;
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
    setSubmitting(false);
  }

  if (game.player) {
    return <div>Your board has been set.</div>;
  } else {
    return (
      <BoardSetup
        setVerifiedBoard={sendPlayerBoard}
        starterName={getLastUsedName()}
        disabled={submitting}
        readyBtnText={submitting ? "Verifying..." : undefined}
      />
    );
  }
}
