import { ShipSelector, shipSelectorProps } from "./ShipSelector";
import "./SetupMenu.css";
import { NameInput, nameInputProps } from "./NameInput";

type setupMenuProps = {
  verified: boolean;
  onReadyClick: () => void;
} & shipSelectorProps &
  nameInputProps;

export function SetupMenu({
  board,
  setBoard,
  shipsToPlace,
  selectedIndex,
  setSelectedIndex,
  horizontal,
  setHorizontal,
  verified,
  setVerified,
  onReadyClick,
}: setupMenuProps) {
  return (
    <div className="setup-menu">
      <div className="setup-menu-title">PLACE YOUR SHIPS</div>
      <NameInput board={board} setBoard={setBoard} setVerified={setVerified} />
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
