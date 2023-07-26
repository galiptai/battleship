import { ShipSelector, ShipSelectorProps } from "./ShipSelector";
import "./SetupMenu.css";
import { NameInput, NameInputProps } from "./NameInput";

type SetupMenuProps = {
  verified: boolean;
  onReadyClick: () => void;
} & ShipSelectorProps &
  NameInputProps;

export function SetupMenu({
  board,
  setBoard,
  shipsToPlace,
  verified,
  setVerified,
  onReadyClick,
}: SetupMenuProps) {
  return (
    <div className="setup-menu">
      <div className="setup-menu-title">PLACE YOUR SHIPS</div>
      <NameInput board={board} setBoard={setBoard} setVerified={setVerified} />
      <ShipSelector shipsToPlace={shipsToPlace} />
      <button className="setup-ready-btn" disabled={!verified} onClick={onReadyClick}>
        READY
      </button>
    </div>
  );
}
