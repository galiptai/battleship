import { Tile, DrawTile, DrawCoordTile } from "./Tile";
import "./DrawBoard.css";
import { useLayoutEffect, useRef, useState } from "react";
import { Fragment } from "react";
import {
  Dimensions,
  calculateBoardDimensions,
  createLetterArray,
} from "../../logic/renderFunctions";
import { Board } from "../../logic/Board";
import { ShipPlacement } from "../setup/ShipSelector";

export type Coordinate = {
  y: number;
  x: number;
};

export type HighlightType = "neutral" | "valid" | "invalid" | "none";

export type Highlight = {
  tiles: Tile[];
  type: HighlightType;
};

export type ShowShips = "all" | "hit";

type DrawBoardProps = {
  board: Board;
  showShips: ShowShips;
  highlight?: Highlight;
  onClick?: (coordinate: Coordinate) => void;
  clickCheck?: (coordinate: Coordinate) => boolean;
  onDrop?: (startCoordinate: Coordinate, placement: ShipPlacement) => void;
  dropCheck?: (startCoordinate: Coordinate, placement: ShipPlacement) => boolean;
  highlighter?: (startCoordinate: Coordinate | null, placement: ShipPlacement | null) => void;
};

export function DrawBoard({
  board,
  showShips,
  highlight,
  onClick,
  clickCheck,
  onDrop,
  dropCheck,
  highlighter,
}: DrawBoardProps) {
  const [boardDimensions, setBoardDimensions] = useState<Dimensions>({ height: 0, width: 0 });
  const container = useRef<HTMLDivElement>(null);
  const componentDidMount = useRef<boolean>(false);

  useLayoutEffect(() => {
    function resize() {
      if (container.current) {
        const containerSize = {
          height: container.current.getBoundingClientRect().height,
          width: container.current.getBoundingClientRect().width,
        };
        setBoardDimensions(
          calculateBoardDimensions(containerSize, board.height + 1, board.width + 1)
        );
      }
    }
    if (!componentDidMount.current) {
      resize();
      componentDidMount.current = true;
    }
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [board]);

  return (
    <div className="board-container" ref={container}>
      <div
        className="board"
        style={{
          gridTemplateColumns: `repeat(${board.width + 1}, ${
            boardDimensions.width / (board.width + 1)
          }px)`,
          height: boardDimensions.height,
          width: boardDimensions.width,
          fontSize: boardDimensions.height / (board.height + 1) / 3,
        }}
      >
        {createLetterArray(board.width).map((letter) => (
          <DrawCoordTile key={letter} character={letter} />
        ))}
        {board.tiles.map((row: Tile[], y) => (
          <Fragment key={y}>
            <DrawCoordTile character={y + 1} />
            {row.map((tile, x) => (
              <DrawTile
                key={x}
                tile={tile}
                onClick={onClick}
                clickCheck={clickCheck}
                highlighted={highlight && highlight.tiles.includes(tile) ? highlight.type : "none"}
                showShip={showShips}
                onDrop={onDrop}
                dropCheck={dropCheck}
                highlighter={highlighter}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
