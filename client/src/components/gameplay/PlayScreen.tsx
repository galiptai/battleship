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
  function onClick(selection: Highlight) {
    return;
  }

  function highlightAssigner(hoverCoordinate: Coordinate | null): Highlight {
    return {
      type: "neutral",
      tiles: [],
    };
  }

  return (
    <div className="play-screen">
      <div className="play-opponent-board">
        <DrawBoard
          board={opponentBoard}
          onClick={onOppBoardClick}
          highlightAssigner={oppBoardHighlightAssigner}
          showShips="hit"
        />
      </div>
      <div className="play-player-board">
        <DrawBoard
          board={playerBoard}
          onClick={onClick}
          highlightAssigner={highlightAssigner}
          showShips="all"
        />
      </div>
      <div className="play-menu-container">{children}</div>
    </div>
  );
}
