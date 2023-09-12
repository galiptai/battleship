import { useState } from "react";
import { Ship, ShipType } from "../../../logic/Ship";
import { ShipDrag } from "./ShipDrag";

type ShipSelectOptionProps = {
  shipType: ShipType;
  ships: Ship[];
  vertical: boolean;
  disabled?: boolean;
  displayAmount: boolean;
};

export function ShipSelectOption({
  shipType,
  ships,
  vertical,
  disabled,
  displayAmount,
}: ShipSelectOptionProps) {
  const [hovered, setHovered] = useState<boolean>();
  const [dragging, setDragging] = useState<boolean>(false);
  const unplacedShips = ships.filter((ships) => ships.tiles.length === 0);
  let shipToDrag: Ship | undefined;
  if (!disabled && unplacedShips.length > 0) {
    shipToDrag = unplacedShips[0];
  }

  let classes = "ship-sel-opt";
  if (!shipToDrag) {
    classes = classes + " ship-sel-disabled";
  } else if (dragging || hovered) {
    classes = classes + " ship-sel-highlight";
  }
  return (
    <div
      className={classes}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {`${shipType.name}${displayAmount ? ` (${unplacedShips.length})` : ""}`}
      <ShipDrag
        ship={shipToDrag}
        vertical={vertical}
        setDragging={setDragging}
        afterDrop={() => setHovered(false)}
      />
    </div>
  );
}
