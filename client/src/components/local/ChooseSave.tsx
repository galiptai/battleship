import { SaveData } from "../../logic/GameSave";
import { Choice } from "./LocalLoader";
import "./ChooseSave.css";

type ChooseSaveProps = {
  saveData: SaveData;
  setUseSave: (choice: Choice) => void;
};

export function ChooseSave({ saveData, setUseSave }: ChooseSaveProps) {
  return (
    <div className="choose-save">
      <div>
        <div>Save found.</div>
        <div className="choose-save-players">
          <div>{saveData.player1}</div>
          <div>vs</div>
          <div>{saveData.player2}</div>
        </div>
        <div>Saved: {saveData.date.toLocaleString("hu-HU")}</div>
      </div>
      <div>
        <div>Load?</div>
        <div className="choose-save-buttons">
          <button onClick={() => setUseSave("Yes")}>Yes</button>
          <button onClick={() => setUseSave("No")}>No</button>
        </div>
      </div>
    </div>
  );
}
