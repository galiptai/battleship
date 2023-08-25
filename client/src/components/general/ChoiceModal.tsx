import "./ChoiceModal.css";

type ChoiceModalProps = {
  display: boolean;
  background?: boolean;
  question: string;
  description?: string;
  confirmText?: string;
  onConfirm: () => void;
  cancelText?: string;
  onCancel: () => void;
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
            <button onClick={onConfirm}>{confirmText}</button>
            <button onClick={onCancel}>{cancelText}</button>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
