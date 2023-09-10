import { ChangeEvent } from "react";
import CSS from "csstype";
import "./NumberInput.css";

type NumberInputProps = {
  value: number;
  setValue: (value: number) => void;
  label?: string;
  id: string;
  min?: number;
  max?: number;
  align?: CSS.Property.FlexDirection;
};

export function NumberInput({ value, setValue, label, id, min, max, align }: NumberInputProps) {
  min = min ?? -Infinity;
  max = max ?? Infinity;
  if (max < min) {
    throw new Error("Max can't be smaller than min!");
  }
  align = align ?? "row";

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    let value = Math.floor(event.currentTarget.valueAsNumber);
    if (isNaN(value)) {
      value = 0;
    }
    setValue(value);
  }

  function increaseValue() {
    if (value < min!) {
      setValue(min!);
    } else {
      const newValue = ++value;
      if (newValue <= max!) {
        setValue(newValue);
      }
    }
  }

  function decreaseValue() {
    if (value > max!) {
      setValue(max!);
    } else {
      const newValue = --value;
      if (newValue >= min!) {
        setValue(newValue);
      }
    }
  }

  function onFocus(event: React.FocusEvent<HTMLInputElement>) {
    event.target.select();
  }

  const valid = value >= min && value <= max;
  return (
    <div className="number-input-container" style={{ flexDirection: align }}>
      {label && <label htmlFor={id}>{label}</label>}
      <div className="number-input">
        <button onClick={decreaseValue} disabled={value <= min}>
          -
        </button>
        <input
          className={valid ? "" : "input-invalid"}
          id={id}
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          onFocus={onFocus}
        />
        <button onClick={increaseValue} disabled={value >= max}>
          +
        </button>
      </div>
    </div>
  );
}
