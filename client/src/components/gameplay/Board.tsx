import { Ship } from "../../logic/Ship";
import { Tile, DrawTile, DrawCoordTile } from "./Tile";
import "./Board.css";
import { useEffect, useRef, useState } from "react";
import { Fragment } from "react";
import { calculateBoardDimensions, createLetterArray } from "../../logic/renderFunctions";

export type Board = {
  player: string;
  height: number;
  width: number;
  ships: Set<Ship>;
  tiles: Tile[][];
};

export type Coordinate = {
  y: number;
  x: number;
};

export type Guess = {
  coordinate: Coordinate;
  hit: boolean;
  player: string;
};

export type HighlightType = "neutral" | "valid" | "invalid" | "none";

export type Highlight = {
  tiles: Tile[];
  type: HighlightType;
};

export type ShowShips = "all" | "hit";

export type Dimensions = {
  height: number;
  width: number;
};

type DrawBoardProps = {
  board: Board;
  onClick?: (selection: Highlight) => void;
  highlightAssigner?: (hoverCoordinate: Coordinate | null) => Highlight;
  showShips: ShowShips;
};

export function DrawBoard({ board, onClick, highlightAssigner, showShips }: DrawBoardProps) {
  const [hoverCoordinate, setHoverCoordinate] = useState<Coordinate | null>(null);
  const [boardDimensions, setBoardDimensions] = useState<Dimensions>({ height: 0, width: 0 });
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function resize() {
      if (container.current) {
        const containerSize = {
          height: container.current.getBoundingClientRect().height,
          width: container.current.getBoundingClientRect().width,
        };
        setBoardDimensions(calculateBoardDimensions(containerSize, board.height, board.width));
      }
    }

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [board]);

  useEffect(() => {
    if (container.current) {
      const containerSize = {
        height: container.current.getBoundingClientRect().height,
        width: container.current.getBoundingClientRect().width,
      };
      setBoardDimensions(calculateBoardDimensions(containerSize, board.height, board.width));
    }
  }, [board]);

  const highlight: Highlight = highlightAssigner
    ? highlightAssigner(hoverCoordinate)
    : { type: "none", tiles: [] };
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
                onClick={onClick ? () => onClick(highlight) : undefined}
                setHoverCoordinate={setHoverCoordinate}
                highlighted={highlight.tiles.includes(tile) ? highlight.type : "none"}
                showShip={showShips}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
