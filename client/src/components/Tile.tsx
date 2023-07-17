import { Coordinate, HighlightType } from "./Board";
import { ShipType } from "../logic/Ship";
import "./Tile.css";

export type Tile = {
  coordinate: Coordinate;
  hit: boolean;
  placedShip: ShipType | null;
};

type drawTileProps = {
  tile: Tile;
  onClick: () => void;
  setHoverCoordinate: (coordinate: Coordinate | null) => void;
  highlighted: HighlightType | null;
};
export function DrawTile({ tile, onClick, setHoverCoordinate, highlighted }: drawTileProps) {
  let classes = "tile";
  if (highlighted !== null) {
    switch (highlighted) {
      case "neutral":
        classes = classes + " tile-highlight";
        break;
      case "valid":
        classes = classes + " tile-valid";
        break;
      case "invalid":
        classes = classes + " tile-invalid";
        break;
    }
  }

  return (
    <div
      onClick={() => onClick()}
      onPointerEnter={() => setHoverCoordinate(tile.coordinate)}
      onPointerLeave={() => setHoverCoordinate(null)}
      className={classes}
    >
      <div>
        X:{tile.coordinate.x} Y:{tile.coordinate.y}
      </div>
      <div>{tile.placedShip !== null ? tile.placedShip : ""}</div>
    </div>
  );
}
