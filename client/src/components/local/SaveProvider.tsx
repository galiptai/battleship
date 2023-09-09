import { ReactNode, createContext, useContext, useRef, useState } from "react";
import { GameSave } from "../../logic/GameSave";
import { LocalGame } from "../../logic/LocalGame";
import { deleteGame, getGameSave, saveGame } from "../../logic/storageFunctions";
import { ChoiceModal } from "../general/ChoiceModal";
import { SaveInfo } from "./SaveInfo";

function load(): GameSave | null {
  const data = getGameSave();
  if (data === null) {
    return null;
  } else {
    return GameSave.fromJSON(data);
  }
}

function getSavedGame(): LocalGame {
  const save = load();
  if (save === null || !save.isValid()) {
    return new GameSave(null, null, "PLAYER1", [], new Date()).getGame();
  } else {
    return save.getGame();
  }
}

function manageSave(game: LocalGame) {
  if (game.winner === null) {
    const save = GameSave.fromLocalGame(game, new Date());
    if (save.isValid()) {
      saveGame(save);
    }
  } else {
    deleteGame();
  }
}

type SaveContextType = {
  getSavedGame: () => LocalGame;
  manageSave: (game: LocalGame) => void;
};

const SaveContext = createContext<SaveContextType>(null!);

export function SaveProvider({ children }: { children: ReactNode }) {
  const initialSave = useRef<GameSave | null>(load());
  const [askLoad, setAskLoad] = useState<boolean>(() =>
    initialSave.current !== null && initialSave.current.isValid() ? true : false
  );

  if (askLoad) {
    return (
      <ChoiceModal
        display
        question="Save data found. Load?"
        description={<SaveInfo saveData={initialSave.current!.getSaveData()} />}
        onConfirm={() => setAskLoad(false)}
        onCancel={() => {
          deleteGame();
          setAskLoad(false);
        }}
      />
    );
  } else {
    return (
      <SaveContext.Provider value={{ getSavedGame, manageSave }}>{children}</SaveContext.Provider>
    );
  }
}

export function useSave() {
  return useContext(SaveContext);
}
