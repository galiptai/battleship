import { Board } from "../../logic/Board";
import "./NameInput.css";

export type NameInputProps = {
  board: Board;
  setBoard: (board: Board) => void;
  setVerified: (verified: boolean) => void;
};

export function NameInput({ board, setBoard, setVerified }: NameInputProps) {
  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    board.player = event.target.value;
    setBoard(board.makeCopy());
    setVerified(board.isValid());
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
        maxLength={30}
      />
    </div>
  );
}
