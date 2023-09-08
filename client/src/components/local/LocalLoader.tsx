import { useCallback, useState, useRef } from "react";
import { GameSave } from "../../logic/GameSave";
import { LocalGame } from "./LocalGame";
import { SaveInfo } from "./SaveInfo";
import { deleteGame, getGame, saveGame } from "../../logic/storageFunctions";
import { Choice, ChoiceModal } from "../general/ChoiceModal";

function load(): GameSave | null {
  const data = getGame();
  if (data === null) {
    return null;
  } else {
    return GameSave.fromJSON(data);
  }
}

export function LocalLoader() {
  const save = useRef<GameSave | null>(load());
  const [useSave, setUseSave] = useState<Choice>("Undecided");

  const updateSave = useCallback((save: GameSave) => {
    if (save.isValid()) {
      saveGame(save);
    }
  }, []);

  const deleteSave = useCallback(() => {
    deleteGame();
  }, []);

  if (save.current !== null && save.current.isValid() && useSave === "Undecided") {
    return (
      <ChoiceModal
        display
        question="Save data found. Load?"
        description={<SaveInfo saveData={save.current.getSaveData()} />}
        onConfirm={() => setUseSave("Yes")}
        onCancel={() => setUseSave("No")}
      />
    );
  } else if (save.current !== null && save.current.isValid() && useSave === "Yes") {
    return <LocalGame save={save.current} updateSave={updateSave} deleteSave={deleteSave} />;
  } else {
    return (
      <LocalGame
        save={new GameSave(null, null, [], new Date())}
        updateSave={updateSave}
        deleteSave={deleteSave}
      />
    );
  }
}
