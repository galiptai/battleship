import { useCallback, useState, useRef } from "react";
import { GameSave, PlainGameSave } from "../../logic/GameSave";
import { LocalGame } from "./LocalGame";
import { ChooseSave } from "./ChooseSave";

export type Choice = "Yes" | "No" | "Undecided";

function load(): GameSave | null {
  const json = localStorage.getItem("save");
  if (json === null) {
    return json;
  } else {
    const data = JSON.parse(json) as PlainGameSave;
    return GameSave.fromJSON(data);
  }
}

export function LocalLoader() {
  const save = useRef<GameSave | null>(load());
  const [useSave, setUseSave] = useState<Choice>("Undecided");

  const updateSave = useCallback((save: GameSave) => {
    if (save.isValid()) {
      localStorage.setItem("save", JSON.stringify(save));
    }
  }, []);

  const deleteSave = useCallback(() => {
    localStorage.removeItem("save");
  }, []);

  if (save.current !== null && save.current.isValid() && useSave === "Undecided") {
    return <ChooseSave saveData={save.current.getSaveData()} setUseSave={setUseSave} />;
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
