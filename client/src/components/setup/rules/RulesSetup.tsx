import { RuleData, Rules } from "../../../logic/Rules";
import { useState } from "react";
import { Menu } from "../../general/Menu";
import { RulesForm } from "./RulesForm";

type RulesSetupProps = {
  onRulesSubmit: (rule: RuleData) => void;
};

export function RulesSetup({ onRulesSubmit }: RulesSetupProps) {
  const [displayRulesForm, setDisplayRulesForm] = useState<boolean>(false);

  if (!displayRulesForm) {
    return (
      <Menu
        title="Rules"
        options={[
          <div onClick={() => onRulesSubmit(Rules.CLASSIC_RULES)}>Classic</div>,
          <div onClick={() => setDisplayRulesForm(true)}>Custom</div>,
        ]}
      />
    );
  } else {
    return <RulesForm onRulesSubmit={onRulesSubmit} />;
  }
}
