import { useState } from "react";
import { Board } from "../../logic/Board";
import { CustomError, isErrorMessage } from "../../logic/CustomError";
import { BoardData } from "../../logic/GameSave";
import { OnlineGame } from "../../logic/OnlineGame";
import { getId, getLastUsedName, saveName } from "../../logic/storageFunctions";
import { MessageOverlay } from "../general/MessageOverlay";
import { BoardSetup } from "../setup/BoardSetup";

type OnlineSetupProps = {
  game: OnlineGame;
  setGame: React.Dispatch<React.SetStateAction<OnlineGame | null>>;
  displayError: (error: unknown) => void;
};

export function OnlineSetup({ game, setGame, displayError }: OnlineSetupProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);

  async function sendPlayerBoard(board: Board) {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/v1/game/${game.id}/setBoard?playerId=${getId()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(BoardData.getDataFromBoard(board)),
      });
      if (res.ok) {
        setGame((game) => {
          const newGame = game!.makeCopy();
          newGame.setPlayerBoard(board);
          return newGame;
        });
        saveName(board.player);
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
    setSubmitting(false);
  }

  const boardSet = game.getPlayerBoard() != null;
  return (
    <>
      <BoardSetup
        rules={game.rules}
        setVerifiedBoard={sendPlayerBoard}
        starterName={getLastUsedName()}
        disabled={submitting || boardSet}
        readyBtnText={submitting ? "Verifying..." : undefined}
      />
      <MessageOverlay
        display={boardSet}
        background
        message="Your board is set."
        description="Waiting for other player."
      />
    </>
  );
}
