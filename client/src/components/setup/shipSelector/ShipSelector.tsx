import { useState } from "react";
import { SHIP_TYPES, Ship, ShipTypeKey } from "../../../logic/Ship";
import { DraggedShipPreview } from "./ShipDrag";
import { ShipSelectOption } from "./ShipSelectOption";
import "./ShipSelector.css";

export type ShipSelectorProps = {
  shipsToPlace: Map<ShipTypeKey, Ship[]>;
  disabled?: boolean;
};

export function ShipSelector({ shipsToPlace, disabled }: ShipSelectorProps) {
  const [vertical, setVertical] = useState<boolean>(true);
  const displayAmounts = Array.from(shipsToPlace.values()).some((ships) => ships.length > 1);
  return (
    <div className="ship-selector">
      <DraggedShipPreview />
      <div className="ship-sel-vertical">
        <button onClick={() => setVertical(!vertical)} disabled={disabled}>
          {vertical ? "VERTICAL" : "HORIZONTAL"}
        </button>
      </div>
      <div className="ship-sel-opts-container">
        <div className="ship-sel-opts-instruction">↓&nbsp;Drag ships to the board&nbsp;↓</div>
        <div className="ship-sel-opts">
          {Array.from(shipsToPlace.keys()).map((shipTypeKey) => (
            <ShipSelectOption
              key={shipTypeKey}
              shipType={SHIP_TYPES[shipTypeKey]}
              ships={shipsToPlace.get(shipTypeKey)!}
              vertical={vertical}
              disabled={disabled}
              displayAmount={displayAmounts}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
