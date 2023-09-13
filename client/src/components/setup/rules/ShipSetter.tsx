import { Rules } from "../../../logic/Rules";
import { Dispatch, SetStateAction } from "react";
import { NumberInput } from "../../general/NumberInput";
import { SHIP_TYPES, ShipTypeKey } from "../../../logic/Ship";
import { useState } from "react";
import "./ShipSetter.css";

type ShipSetterProps = {
  rules: Rules;
  setRules: Dispatch<SetStateAction<Rules>>;
};

export function ShipSetter({ rules, setRules }: ShipSetterProps) {
  const [hideShips, setHideShips] = useState<boolean>(true);
  function updateShipAmount(shipType: ShipTypeKey, amount: number) {
    setRules((rules) => {
      const newRules = rules.makeCopy();
      newRules.setShipAmount(shipType, amount);
      return newRules;
    });
  }

  const totalShips = rules.getTotalShipAmount();

  return (
    <div className="ship-setter">
      <div className="ship-setter-header" onClick={() => setHideShips(!hideShips)}>
        <div>{`Ships: ${totalShips}`}</div>
        <button
          className="ship-setter-open"
          style={hideShips ? {} : { transform: "rotateX(180deg)" }}
        >
          ▼
        </button>
      </div>
      <div className="ship-setter-ships-container" style={hideShips ? { maxHeight: 0 } : {}}>
        <div className="ship-setter-ships">
          {rules.getShips().map((ship) => (
            <div className="ship-setter-ship" key={ship[0]}>
              <div>{`${SHIP_TYPES[ship[0]].name}:`}</div>
              <NumberInput
                value={ship[1]}
                id={ship[0]}
                setValue={(value) => updateShipAmount(ship[0], value)}
                min={Rules.MIN_SHIPS_PER_TYPE}
                max={Rules.MAX_SHIPS_PER_TYPE}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
