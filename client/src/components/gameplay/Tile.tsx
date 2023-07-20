import { Coordinate, HighlightType, ShowShips } from "./Board";
import { ShipType } from "../../logic/Ship";
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
  highlighted: HighlightType;
  showShip: ShowShips;
};
export function DrawTile({
  tile,
  onClick,
  setHoverCoordinate,
  highlighted,
  showShip,
}: drawTileProps) {
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
      onClick={() => onClick()}
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
        <div>{placed ? tile.placedShip : ""}</div>
      </div>
    </div>
  );
}

type drawCoordTileProps = {
  character: number | string;
};
export function DrawCoordTile({ character }: drawCoordTileProps) {
  return <div className="tile coord-tile">{character}</div>;
}
