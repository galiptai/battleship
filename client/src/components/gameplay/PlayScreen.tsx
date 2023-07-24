import { Board, Coordinate, DrawBoard, Highlight } from "./Board";
import "./PlayScreen.css";

type playScreenProps = {
  playerBoard: Board;
  opponentBoard: Board;
  onOppBoardClick: (selection: Highlight) => void;
  oppBoardHighlightAssigner: (hoverCoordinate: Coordinate | null) => Highlight;
  children?: JSX.Element;
};

export function PlayScreen({
  playerBoard,
  opponentBoard,
  onOppBoardClick,
  oppBoardHighlightAssigner,
  children,
}: playScreenProps) {
  return (
    <div className="play-screen">
      <div className="play-opponent-board-contatiner">
        <DrawBoard
          board={opponentBoard}
          onClick={onOppBoardClick}
          highlightAssigner={oppBoardHighlightAssigner}
          showShips="hit"
        />
      </div>
      <div className="play-player-board-contatiner">
        <DrawBoard board={playerBoard} showShips="all" />
      </div>
      <div className="play-menu-container">{children}</div>
    </div>
  );
}
