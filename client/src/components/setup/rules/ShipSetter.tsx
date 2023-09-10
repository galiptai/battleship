import { Rules } from "../../../logic/Rules";
import { Dispatch, SetStateAction } from "react";
import { NumberInput } from "../../general/NumberInput";
import { SHIP_TYPES, ShipTypeKey } from "../../../logic/Ship";

type ShipSetterProps = {
  rules: Rules;
  setRules: Dispatch<SetStateAction<Rules>>;
};

export function ShipSetter({ rules, setRules }: ShipSetterProps) {
  function updateShipAmount(shipType: ShipTypeKey, amount: number) {
    setRules((rules) => {
      const newRules = rules.makeCopy();
      newRules.setShipAmount(shipType, amount);
      return newRules;
    });
  }

  return (
    <div>
      <div>Ships:</div>
      {rules.getShips().map((ship) => (
        <div key={ship[0]}>
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
  );
}
