import { Coordinate, HighlightType, ShowShips } from "./DrawBoard";
import { Ship } from "../../logic/Ship";
import "./Tile.css";
import { useDrop } from "react-dnd";
import { ShipPlacement } from "../setup/ShipSelector";
import { useEffect } from "react";

export type Tile = {
  coordinate: Coordinate;
  hit: boolean;
  placedShip: Ship | null;
};

type DrawTileProps = {
  tile: Tile;
  highlighted: HighlightType;
  showShip: ShowShips;
  onClick?: (coordinate: Coordinate) => void;
  clickCheck?: (coordinate: Coordinate) => boolean;
  onDrop?: (startCoordinate: Coordinate, placement: ShipPlacement) => void;
  dropCheck?: (startCoordinate: Coordinate, placement: ShipPlacement) => boolean;
  highlighter?: (startCoordinate: Coordinate | null, placement: ShipPlacement | null) => void;
};
export function DrawTile({
  tile,
  highlighted,
  showShip,
  onClick,
  clickCheck,
  onDrop,
  dropCheck,
  highlighter,
}: DrawTileProps) {
  const [{ isOver, item }, drop] = useDrop(
    () => ({
      accept: "ship",
      drop: (item: ShipPlacement) => onDrop?.(tile.coordinate, item),
      canDrop: (item: ShipPlacement) => (dropCheck ? dropCheck(tile.coordinate, item) : false),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        item: monitor.getItem(),
      }),
    }),
    [tile, onDrop, dropCheck]
  );

  useEffect(() => {
    if (isOver) {
      highlighter?.(tile.coordinate, item);
    }
    return () => highlighter?.(null, null);
  }, [isOver, highlighter, tile, item]);

  let hasShip = "";

  if (tile.placedShip !== null && (showShip === "all" || (showShip === "hit" && tile.hit))) {
    hasShip = "tile-ship";
  }

  let overlay = "tile-overlay";
  switch (highlighted) {
    case "valid":
      overlay = overlay + " tile-valid";
      break;
    case "invalid":
      overlay = overlay + " tile-invalid";
      break;
  }
  if (clickCheck?.(tile.coordinate)) {
    overlay = overlay + " tile-clickable";
  }

  return (
    <div
      onClick={() => onClick?.(tile.coordinate)}
      className={`tile play-tile ${hasShip}`}
      ref={drop}
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
        <div>{hasShip ? tile.placedShip?.type : ""}</div>
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
