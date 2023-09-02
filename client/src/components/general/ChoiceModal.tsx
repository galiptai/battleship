import "./ChoiceModal.css";
import { ReactNode } from "react";

export type Choice = "Yes" | "No" | "Undecided";

type ChoiceModalProps = {
  display: boolean;
  background?: boolean;
  question: string;
  description?: string | ReactNode;
  confirmText?: string;
  onConfirm: () => void;
  cancelText?: string;
  onCancel: () => void;
  disableButtons?: boolean;
};

export function ChoiceModal({
  display,
  background,
  question,
  description,
  confirmText,
  onConfirm,
  cancelText,
  onCancel,
  disableButtons,
}: ChoiceModalProps) {
  confirmText = confirmText ?? "YES";
  cancelText = cancelText ?? "NO";

  if (display) {
    return (
      <div className={`choice-modal ${background ? "choice-modal-background" : ""}`}>
        <div className="choice-modal-box">
          <div className="choice-modal-question">{question}</div>
          {description && <div className="choice-modal-description">{description}</div>}
          <div className="choice-modal-buttons">
            <button onClick={onConfirm} disabled={disableButtons}>
              {confirmText}
            </button>
            <button onClick={onCancel} disabled={disableButtons}>
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
