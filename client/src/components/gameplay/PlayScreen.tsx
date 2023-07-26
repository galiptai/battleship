import { Board } from "../../logic/Board";
import { Coordinate, DrawBoard } from "./DrawBoard";
import "./PlayScreen.css";

type PlayScreenProps = {
  playerBoard: Board;
  opponentBoard: Board;
  onOppBoardClick: (coordinate: Coordinate) => void;
  oppBoardClickCheck: (coordinate: Coordinate) => boolean;
  children?: JSX.Element;
};

export function PlayScreen({
  playerBoard,
  opponentBoard,
  onOppBoardClick,
  oppBoardClickCheck,
  children,
}: PlayScreenProps) {
  return (
    <div className="play-screen">
      <div className="play-opponent-board-container">
        <DrawBoard
          board={opponentBoard}
          onClick={onOppBoardClick}
          clickCheck={oppBoardClickCheck}
          showShips="hit"
        />
      </div>
      <div className="play-player-board-container">
        <DrawBoard board={playerBoard} showShips="all" />
      </div>
      <div className="play-menu-container">{children}</div>
    </div>
  );
}
