import { Ship } from "../logic/Ship";
import { Tile, DrawTile } from "./Tile";
import "./Board.css";
import { useState } from "react";
import { Fragment } from "react";

export type Board = {
  player: string;
  height: number;
  width: number;
  ships: Ship[];
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

type drawBoardProps = {
  board: Board;
  onClick: (selection: Highlight) => void;
  highlightAssigner: (hoverCoordinate: Coordinate | null) => Highlight;
  showShips: ShowShips;
};

export function DrawBoard({ board, onClick, highlightAssigner, showShips }: drawBoardProps) {
  const [hoverCoordinate, setHoverCoordinate] = useState<Coordinate | null>(null);

  const highlight = highlightAssigner(hoverCoordinate);
  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${board.width}, minmax(20px, 1fr))`,
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
              highlighted={highlight.tiles.includes(tile) ? highlight.type : "none"}
              showShip={showShips}
            />
          ))}
        </Fragment>
      ))}
    </div>
  );
}
