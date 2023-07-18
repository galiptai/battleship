import { Board, Coordinate, DrawBoard, Highlight } from "./Board";
import "./PlayScreen.css";

type playScreenProps = {
  playerBoard: Board;
  setPlayerBoard: (board: Board) => void;
  opponentBoard: Board;
  setOpponentBoard: (board: Board) => void;
};
export function PlayScreen({ playerBoard, setPlayerBoard, opponentBoard, setOpponentBoard }: playScreenProps) {
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
        <DrawBoard board={opponentBoard} onClick={onClick} highlightAssigner={highlightAssigner} showShips="hit" />
      </div>
      <div className="play-side">
        <div className="play-player-board">
          <DrawBoard board={playerBoard} onClick={onClick} highlightAssigner={highlightAssigner} showShips="hit" />
        </div>
        <div className="play-log">LOG GOES HERE</div>
      </div>
    </div>
  );
}
