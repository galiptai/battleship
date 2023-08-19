import { useState } from "react";
import { Board } from "../../logic/Board";
import { PlayScreen } from "../gameplay/PlayScreen";
import { PlayMenu } from "../gameplay/PlayMenu";
import { Guess } from "../../logic/gameLogic";
import { WhichPlayer } from "./OnlineGame";

type OnlinePlayProps = {
  playerBoard: Board;
  opponentBoard: Board;
  isPlayersTurn: boolean;
  whichPlayer: WhichPlayer;
  guesses: Guess[];
};

export function OnlinePlay({
  playerBoard,
  opponentBoard,
  isPlayersTurn,
  whichPlayer,
  guesses,
}: OnlinePlayProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  function onOppBoardClick(coordinate: Coordinate) {
    if (!isPlayersTurn || submitting) {
      return;
    }
  }

  function oppBoardClickCheck(coordinate: Coordinate): boolean {
    return false;
  }
  return (
    <PlayScreen
      playerBoard={playerBoard}
      opponentBoard={opponentBoard}
      onOppBoardClick={onOppBoardClick}
      oppBoardClickCheck={oppBoardClickCheck}
    >
      <PlayMenu
        guesses={guesses}
        player1={whichPlayer == "PLAYER1" ? playerBoard.player : opponentBoard.player}
        player2={whichPlayer == "PLAYER1" ? opponentBoard.player : playerBoard.player}
      ></PlayMenu>
    </PlayScreen>
  );
}
