import { Ship } from "../logic/Ship";
import "./ShipSelector.css";

type shipSelectorProps = {
  shipsToPlace: Ship[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  horizontal: boolean;
  setHorizontal: (horizontal: boolean) => void;
};

export function ShipSelector({
  shipsToPlace,
  selectedIndex,
  setSelectedIndex,
  horizontal,
  setHorizontal,
}: shipSelectorProps) {
  return (
    <div className="ship-selector">
      <div>Ships</div>
      <div>
        <label htmlFor="horizontal">Horziontal?</label>
        <input
          type="checkbox"
          checked={horizontal}
          onChange={(e) => setHorizontal(e.target.checked)}
        />
      </div>
      <div
        className="ship-sel-opts"
        style={{ gridTemplateRows: `repeat(${shipsToPlace.length}, 1fr)` }}
      >
        {shipsToPlace.map((ship, i) => (
          <ShipSelectOption
            key={i}
            ship={ship}
            index={i}
            selected={i === selectedIndex}
            setSelectedIndex={setSelectedIndex}
          />
        ))}
      </div>
    </div>
  );
}

type shipSelectOptionProps = {
  ship: Ship;
  index: number;
  selected: boolean;
  setSelectedIndex: (index: number) => void;
};

function ShipSelectOption({
  ship,
  index,
  selected,
  setSelectedIndex,
}: shipSelectOptionProps) {
  const placed = ship.tiles.length !== 0;
  let classes = "ship-sel-opt";
  if (placed) {
    classes = classes + " ship-sel-placed";
  } else if (selected) {
    classes = classes + " ship-sel-selected";
  }

  function onClick() {
    if (selected) {
      setSelectedIndex(-1);
    } else if (!placed) {
      setSelectedIndex(index);
    }
  }
  return (
    <div className={classes} onClick={onClick}>
      {ship.type}
    </div>
  );
}
