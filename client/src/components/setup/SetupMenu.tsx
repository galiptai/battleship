import { ShipSelector, ShipSelectorProps } from "./ShipSelector";
import "./SetupMenu.css";
import { NameInput, NameInputProps } from "./NameInput";

type SetupMenuProps = ShipSelectorProps & NameInputProps;

export function SetupMenu({
  board,
  setBoard,
  shipsToPlace,
  setVerified,
  disabled,
}: SetupMenuProps) {
  return (
    <div className="setup-menu">
      <div className="setup-menu-title">SET YOUR BOARD</div>
      <NameInput board={board} setBoard={setBoard} setVerified={setVerified} disabled={disabled} />
      <ShipSelector shipsToPlace={shipsToPlace} disabled={disabled} />
    </div>
  );
}
