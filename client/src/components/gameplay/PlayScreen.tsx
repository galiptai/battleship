import { useState, ReactNode } from "react";
import { Board } from "../../logic/Board";
import { Coordinate, DrawBoard } from "./DrawBoard";
import "./PlayScreen.css";

type PlayScreenProps = {
  playerBoard: Board;
  opponentBoard: Board;
  onOppBoardClick: (coordinate: Coordinate) => void | Promise<void>;
  oppBoardClickCheck: (coordinate: Coordinate) => boolean;
  playMenu: ReactNode;
};

export function PlayScreen({
  playerBoard,
  opponentBoard,
  onOppBoardClick,
  oppBoardClickCheck,
  playMenu,
}: PlayScreenProps) {
  const [showPlayerBoard, setShowPlayerBoard] = useState<boolean>(false);

  return (
    <div className="play-screen">
      <div className="play-board-switcher">
        <button onClick={() => setShowPlayerBoard(false)} disabled={!showPlayerBoard}>
          OPPONENT'S BOARD
        </button>
        <button onClick={() => setShowPlayerBoard(true)} disabled={showPlayerBoard}>
          YOUR BOARD
        </button>
      </div>
      <div className="play-board-placeholder"></div>
      <div className={`play-opponent-board-container ${showPlayerBoard ? "play-hide" : ""}`}>
        <DrawBoard
          board={opponentBoard}
          onClick={onOppBoardClick}
          clickCheck={oppBoardClickCheck}
          showShips="hit"
        />
      </div>
      <div className={`play-player-board-container ${!showPlayerBoard ? "play-hide" : ""}`}>
        <DrawBoard board={playerBoard} showShips="all" />
      </div>
      <div className="play-menu-container">{playMenu}</div>
    </div>
  );
}
