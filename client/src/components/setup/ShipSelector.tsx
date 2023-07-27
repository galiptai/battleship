import { useState } from "react";
import { Ship } from "../../logic/Ship";
import "./ShipSelector.css";
import { useDrag } from "react-dnd";
import { usePreview } from "react-dnd-multi-backend";

export type ShipPlacement = {
  ship: Ship;
  vertical: boolean;
};

export type ShipSelectorProps = {
  shipsToPlace: Ship[];
};

export function ShipSelector({ shipsToPlace }: ShipSelectorProps) {
  const [vertical, setVertical] = useState<boolean>(true);
  return (
    <div className="ship-selector">
      <DraggedShipPreview />
      <div className="ship-sel-vertical">
        <button onClick={() => setVertical(!vertical)}>
          {vertical ? "VERTICAL" : "HORIZONTAL"}
        </button>
      </div>
      <div className="ship-sel-opts-container">
        <div className="ship-sel-opts-instruction">↓&nbsp;Drag ships to the board&nbsp;↓</div>
        <div className="ship-sel-opts">
          {shipsToPlace.map((ship, i) => (
            <ShipSelectOption key={i} ship={ship} vertical={vertical} />
          ))}
        </div>
      </div>
    </div>
  );
}

type ShipSelectOptionProps = {
  ship: Ship;
  vertical: boolean;
};

function ShipSelectOption({ ship, vertical }: ShipSelectOptionProps) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "ship",
      item: { ship: ship, vertical: vertical },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [vertical]
  );

  const placed = ship.tiles.length !== 0;
  let classes = "ship-sel-opt";
  if (placed) {
    classes = classes + " ship-sel-placed";
  }
  if (isDragging) {
    classes = classes + " ship-sel-dragged";
  }
  return (
    <div className={classes} ref={placed ? undefined : drag}>
      {ship.type}
    </div>
  );
}

function DraggedShipPreview(): JSX.Element | null {
  const preview = usePreview<ShipPlacement>();
  if (!preview.display) {
    return null;
  }
  const { style, item } = preview;
  return (
    <div
      className="ship-sel-opt ship-sel-dragged"
      style={{ ...style, width: "fit-content", zIndex: "101", opacity: "0.5" }}
    >
      {item.ship.type}
    </div>
  );
}
