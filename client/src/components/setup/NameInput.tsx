import { verifyBoard } from "../../logic/gameLogic";
import { Board } from "../gameplay/Board";
import "./NameInput.css";

export type nameInputProps = {
  board: Board;
  setBoard: (board: Board) => void;
  setVerified: (verified: boolean) => void;
};

export function NameInput({ board, setBoard, setVerified }: nameInputProps) {
  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newBoard = { ...board };
    newBoard.player = event.target.value;
    setBoard(newBoard);
    setVerified(verifyBoard(newBoard));
  }

  return (
    <div className="name-input">
      <label htmlFor="name">Name: </label>
      <input
        className={`${board.player === "" ? "name-input-invalid" : ""}`}
        type="text"
        name="name"
        id="name"
        value={board.player}
        onChange={onChange}
      />
    </div>
  );
}
