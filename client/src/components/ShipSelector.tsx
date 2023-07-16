import { Ship } from "../logic/Ship";

type shipSelectorProps = {
  shipsToPlace: Ship[];
};

export function ShipSelector({ shipsToPlace }: shipSelectorProps) {
  return (
    <div>
      {shipsToPlace.map((ship, i) => (
        <div key={i}>{ship.type}</div>
      ))}
    </div>
  );
}
