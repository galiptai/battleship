import { ShipSelector, shipSelectorProps } from "./ShipSelector";
import "./SetupMenu.css";

type setupMenuProps = {
  verified: boolean;
  onReadyClick: () => void;
} & shipSelectorProps;

export function SetupMenu({
  shipsToPlace,
  selectedIndex,
  setSelectedIndex,
  horizontal,
  setHorizontal,
  verified,
  onReadyClick,
}: setupMenuProps) {
  return (
    <div className="setup-menu">
      <ShipSelector
        shipsToPlace={shipsToPlace}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        horizontal={horizontal}
        setHorizontal={setHorizontal}
      />
      <button className="setup-ready-btn" disabled={!verified} onClick={onReadyClick}>
        READY
      </button>
    </div>
  );
}
