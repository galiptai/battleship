import { useState } from "react";
import { useConnection } from "../ConnectionProvider";
import { ChoiceModal } from "../../general/ChoiceModal";
import { validate } from "uuid";
import "./JoinInputModal.css";
import shortUUID from "short-uuid";

type JoinInputModalProps = {
  onCancel: () => void;
};

export function JoinInputModal({ onCancel }: JoinInputModalProps) {
  const { stompClient } = useConnection();
  const [gameId, setGameId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [joining, setJoining] = useState<boolean>(false);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setGameId(event.target.value);
    setMessage("");
  }

  function onFocus(event: React.FocusEvent<HTMLInputElement>) {
    event.target.scrollIntoView();
    event.target.select();
  }

  function join() {
    if (gameId.length === 0) {
      setMessage("ID can't be empty.");
      return;
    }
    const translator = shortUUID();
    const convertedID = translator.toUUID(gameId);
    if (!validate(convertedID)) {
      setMessage("ID format not valid.");
      return;
    }
    const receiptId = translator.generate();
    stompClient.watchForReceipt(receiptId, () => {
      setJoining(false);
    });
    stompClient.publish({
      destination: "/app/join-private",
      headers: { receipt: receiptId },
      body: convertedID,
    });
    setJoining(true);
  }

  return (
    <ChoiceModal
      display
      background
      question="Enter the game ID code:"
      description={
        <div className="join-input">
          <input
            type="text"
            value={gameId}
            onChange={onChange}
            onFocus={onFocus}
            maxLength={22}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === "Enter") {
                join();
              }
            }}
          />
          <div className="join-input-message">{message}</div>
        </div>
      }
      onConfirm={join}
      confirmText="JOIN"
      onCancel={onCancel}
      cancelText="CANCEL"
      disableButtons={joining}
    />
  );
}
