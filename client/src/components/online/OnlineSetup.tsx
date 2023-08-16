import { Board } from "../../logic/Board";
import { BoardData } from "../../logic/GameSave";
import { getId, getLastUsedName } from "../../logic/identification";
import { BoardSetup } from "../setup/BoardSetup";

type OnlineSetupProps = {
  gameId: string;
  playerBoard: Board | null;
  setPlayerBoard: (board: Board) => void;
};

export function OnlineSetup({ gameId, playerBoard, setPlayerBoard }: OnlineSetupProps) {
  async function sendPlayerBoard(board: Board) {
    try {
      const res = await fetch(`api/v1/game/setBoard/${gameId}?playerId=${getId()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(BoardData.getDataFromBoard(board)),
      });
      if (res.ok) {
        setPlayerBoard(board);
      }
    } catch (error) {
      console.error(error);
    }
  }
  if (playerBoard) {
    return <div>Your board has been set.</div>;
  } else {
    return <BoardSetup setVerifiedBoard={sendPlayerBoard} starterName={getLastUsedName()} />;
  }
}
