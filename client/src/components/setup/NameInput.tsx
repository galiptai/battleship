import { Board } from "../../logic/Board";
import "./NameInput.css";

export type NameInputProps = {
  board: Board;
  onNameInput: (value: string) => void;
  disabled?: boolean;
};

export function NameInput({ board, onNameInput: onNameInput, disabled }: NameInputProps) {
  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    onNameInput(event.target.value);
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
