/// <reference types="vite-plugin-svgr/client" />
import { Coordinate, HighlightType, ShowShips } from "./DrawBoard";
import { Ship } from "../../logic/Ship";
import "./Tile.css";
import { useDrop } from "react-dnd";
import { useEffect } from "react";
import { ReactComponent as XSvg } from "../../assets/X.svg";
import { ShipDrop, ShipPlacement } from "../setup/shipSelector/ShipDrag";

export type Tile = {
  coordinate: Coordinate;
  guessed: boolean;
  placedShip: Ship | null;
};

type DrawTileProps = {
  tile: Tile;
  highlighted: HighlightType;
  showShip: ShowShips;
  onClick?: (coordinate: Coordinate) => void | Promise<void>;
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
      drop: (item: ShipDrop) => {
        onDrop?.(tile.coordinate, item.shipPlacement);
        item.afterDrop();
      },
      canDrop: (item: ShipDrop) =>
        dropCheck ? dropCheck(tile.coordinate, item.shipPlacement) : false,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        item: monitor.getItem(),
      }),
    }),
    [tile, onDrop, dropCheck]
  );

  useEffect(() => {
    if (isOver) {
      highlighter?.(tile.coordinate, item.shipPlacement);
    }
    return () => highlighter?.(null, null);
  }, [isOver, highlighter, tile, item]);

  const hasShip = tile.placedShip !== null;
  const isSank = hasShip ? tile.placedShip!.isSank() : false;
  let shipColoring = "";

  if (hasShip && (showShip === "all" || (showShip === "hit" && tile.guessed))) {
    if (isSank) {
      shipColoring = "tile-sunk-ship";
    } else {
      shipColoring = "tile-ship";
    }
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
      onClick={() => void onClick?.(tile.coordinate)}
      className={`tile play-tile ${shipColoring}`}
      ref={drop}
    >
      {tile.guessed && (
        <div className="tile-guessed">
          <XSvg stroke={hasShip ? (isSank ? "black" : "red") : "blue"} />
        </div>
      )}
      <div className={overlay}></div>
    </div>
  );
}

type DrawCoordTileProps = {
  character: number | string;
};
export function DrawCoordTile({ character }: DrawCoordTileProps) {
  return <div className="tile coord-tile">{character}</div>;
}
