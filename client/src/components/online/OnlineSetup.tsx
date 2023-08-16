import { Board } from "../../logic/Board";
import { BoardData } from "../../logic/GameSave";
import { getId, getLastUsedName } from "../../logic/identification";
import { BoardSetup } from "../setup/BoardSetup";
import { useState } from "react";

type OnlineSetupProps = {
  gameId: string;
  playerBoard: Board | null;
  setPlayerBoard: (board: Board) => void;
};

export function OnlineSetup({ gameId, playerBoard, setPlayerBoard }: OnlineSetupProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);

  async function sendPlayerBoard(board: Board) {
    setSubmitting(true);
    try {
      const res = await fetch(`api/v1/game/setBoard/${gameId}?playerId=${getId()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(BoardData.getDataFromBoard(board)),
      });
      if (res.ok) {
        setPlayerBoard(board);
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

  if (playerBoard) {
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
