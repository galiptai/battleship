import { Coordinate, HighlightType, ShowShips } from "./Board";
import { Ship } from "../../logic/Ship";
import "./Tile.css";

export type Tile = {
  coordinate: Coordinate;
  hit: boolean;
  placedShip: Ship | null;
};

type DrawTileProps = {
  tile: Tile;
  onClick?: () => void;
  setHoverCoordinate: (coordinate: Coordinate | null) => void;
  highlighted: HighlightType;
  showShip: ShowShips;
};
export function DrawTile({
  tile,
  onClick,
  setHoverCoordinate,
  highlighted,
  showShip,
}: DrawTileProps) {
  let placed = "";

  if (tile.placedShip !== null && (showShip === "all" || (showShip === "hit" && tile.hit))) {
    placed = "tile-placed";
  }

  let overlay = "tile-overlay";
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
    case "none":
      overlay = "";
  }

  return (
    <div
      onClick={onClick ? () => onClick() : undefined}
      onPointerEnter={() => setHoverCoordinate(tile.coordinate)}
      onPointerLeave={() => setHoverCoordinate(null)}
      className={`tile play-tile ${placed}`}
    >
      {tile.hit && (
        <div className="tile-hit">
          <img src="/X.svg" alt="X" />
        </div>
      )}
      <div className={overlay}></div>
      <div className="tile-data">
        <div>
          Y:{tile.coordinate.y} X:{tile.coordinate.x}
        </div>
        <div>{placed ? tile.placedShip?.type : ""}</div>
      </div>
    </div>
  );
}

type DrawCoordTileProps = {
  character: number | string;
};
export function DrawCoordTile({ character }: DrawCoordTileProps) {
  return <div className="tile coord-tile">{character}</div>;
}
