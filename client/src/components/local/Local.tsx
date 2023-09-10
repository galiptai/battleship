import { useState } from "react";
import { LocalGame } from "../../logic/LocalGame";
import { useSave } from "./SaveProvider";
import { LocalGameFlow } from "./LocalGameFlow";
import { RulesSetup } from "../setup/rules/RulesSetup";
import { RuleData } from "../../logic/Rules";

export function Local() {
  const { getSavedGame } = useSave();
  const [game, setGame] = useState<LocalGame | null>(() => getSavedGame());

  function startGame(rules: RuleData) {
    setGame(new LocalGame(rules, null, null, "PLAYER1", [], null));
  }

  if (!game) {
    return <RulesSetup onRulesSubmit={startGame} />;
  } else {
    return <LocalGameFlow game={game} setGame={setGame} />;
  }
}
