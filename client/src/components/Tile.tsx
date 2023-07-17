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
  const placed = tile.placedShip !== null;
  let overlay = "tile-overlay";
  if (highlighted !== null) {
    switch (highlighted) {
      case "neutral":
        overlay = overlay + " tile-highlight";
        break;
      case "valid":
        overlay = overlay + " tile-valid";
        break;
      case "invalid":
        overlay = overlay + " tile-invalid";
        break;
    }
  }

  return (
    <div
      onClick={() => onClick()}
      onPointerEnter={() => setHoverCoordinate(tile.coordinate)}
      onPointerLeave={() => setHoverCoordinate(null)}
      className={`tile ${placed ? "tile-placed" : ""}`}
    >
      <div className={overlay}>
        <div>
          Y:{tile.coordinate.y} X:{tile.coordinate.x}
        </div>
        <div>{placed ? tile.placedShip : ""}</div>
      </div>
    </div>
  );
}
