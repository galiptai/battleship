import { Ship } from "../logic/Ship";
import { Tile, DrawTile } from "./Tile";
import "./Board.css";
import { useState } from "react";
import { Fragment } from "react";

export type Board = {
  height: number;
  width: number;
  ships: Ship[];
  tiles: Tile[][];
};

export type Coordinate = {
  y: number;
  x: number;
};

export type HighlightType = "neutral" | "valid" | "invalid";

export type Highlight = {
  tiles: Tile[];
  type: HighlightType;
};
type drawBoardProps = {
  board: Board;
  setBoard: (board: Board) => void;
  onClick: (selection: Highlight) => void;
  highlightAssigner: (hoverCoordinate: Coordinate | null) => Highlight;
};

export function DrawBoard({
  board,
  onClick,
  highlightAssigner,
}: drawBoardProps) {
  const [hoverCoordinate, setHoverCoordinate] = useState<Coordinate | null>(
    null
  );

  const highlight = highlightAssigner(hoverCoordinate);
  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${board.width}, 1fr)`,
      }}
    >
      {board.tiles.map((row: Tile[], y) => (
        <Fragment key={y}>
          {row.map((tile, x) => (
            <DrawTile
              key={x}
              tile={tile}
              onClick={() => onClick(highlight)}
              setHoverCoordinate={setHoverCoordinate}
              highlighted={
                highlight.tiles.includes(tile) ? highlight.type : null
              }
            />
          ))}
        </Fragment>
      ))}
    </div>
  );
}
