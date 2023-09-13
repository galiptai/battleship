import { useState } from "react";
import { RuleData, Rules } from "../../../logic/Rules";
import { NumberInput } from "../../general/NumberInput";
import { Dimensions } from "../../../logic/renderFunctions";
import "./RulesForm.css";
import { ShipSetter } from "./ShipSetter";

type RulesFormProps = {
  onRulesSubmit: (rule: RuleData) => void;
};

export function RulesForm({ onRulesSubmit }: RulesFormProps) {
  const [rules, setRules] = useState<Rules>(() => Rules.fromRuleData(Rules.CLASSIC_RULES));

  function updateDimension(dimension: keyof Dimensions, value: number) {
    setRules((rules) => {
      const newRules = rules.makeCopy();
      if (dimension === "height") {
        newRules.setHeight(value);
      } else {
        newRules.setWidth(value);
      }
      return newRules;
    });
  }

  function onStartClick() {
    if (rules.isValid()) {
      onRulesSubmit(rules.getRuleData());
    }
  }
  return (
    <div className="rules-form-container">
      <div className="rules-form-title">Customize rules</div>
      <div className="rules-form-settings">
        <div className="rules-form-dimensions">
          <div>Board dimensions:</div>
          <div className="rules-form-dimensions-controls">
            <NumberInput
              value={rules.getHeight()}
              setValue={(value) => updateDimension("height", value)}
              label="Height:"
              id="height"
              min={Rules.MIN_HEIGHT}
              max={Rules.MAX_HEIGHT}
              align="column"
            />
            <NumberInput
              value={rules.getWidth()}
              setValue={(value) => updateDimension("width", value)}
              label="Width:"
              id="width"
              min={Rules.MIN_WIDTH}
              max={Rules.MAX_WIDTH}
              align="column"
            />
          </div>
        </div>
        <ShipSetter rules={rules} setRules={setRules} />
      </div>
      <div className="rules-form-start">
        <button onClick={onStartClick} disabled={!rules.isValid()}>
          START
        </button>
      </div>
    </div>
  );
}
