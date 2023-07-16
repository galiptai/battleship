import { useState } from "react";
import { Coordinate } from "./Board";
import { ShipType } from "../logic/Ship";

export type Tile = {
  hit: boolean;
  placedShip: ShipType | null;
} & Coordinate;

type drawTileProps = {
  tile: Tile;
  onClick: (y: number, x: number) => void;
};
export function DrawTile({ tile, onClick }: drawTileProps) {
  const [color, setColor] = useState("black");
  return (
    <div
      onClick={() => onClick(tile.y, tile.x)}
      onPointerEnter={() => setColor("white")}
      onPointerLeave={() => setColor("black")}
      className="tile"
      style={{ border: "2px solid white", backgroundColor: color }}
    >
      X:{tile.x} Y:{tile.y}
      {tile.hit ? "Hit" : ""}
    </div>
  );
}
