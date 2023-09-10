import { Board } from "../../logic/Board";
import "./NameInput.css";

export type NameInputProps = {
  board: Board;
  setBoard: (board: Board) => void;
  setVerified: (verified: boolean) => void;
  disabled?: boolean;
};

export function NameInput({ board, setBoard, setVerified, disabled }: NameInputProps) {
  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    board.player = event.target.value;
    setBoard(board.makeCopy());
    setVerified(board.isValid());
  }

  function onFocus(event: React.FocusEvent<HTMLInputElement>) {
    event.target.select();
  }

  return (
    <div className="name-input">
      <label htmlFor="name">Name: </label>
      <input
        className={`${board.player === "" ? "input-invalid" : ""}`}
        type="text"
        name="name"
        id="name"
        value={board.player}
        onChange={onChange}
        onFocus={onFocus}
        maxLength={30}
        disabled={disabled}
        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key === "Enter") {
            const target = event.target as HTMLInputElement;
            target.blur();
          }
        }}
      />
    </div>
  );
}
