import { SaveData } from "../../logic/GameSave";
import "./SaveInfo.css";

type SaveInfoProps = {
  saveData: SaveData;
};

export function SaveInfo({ saveData }: SaveInfoProps) {
  return (
    <div>
      <div>Saved: {saveData.date.toLocaleString("hu-HU")}</div>
      <div className="save-info-players">
        <div>{saveData.player1}</div>
        <div>vs</div>
        <div>{saveData.player2}</div>
      </div>
    </div>
  );
}
