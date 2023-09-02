import { useState } from "react";
import { useConnection } from "../ConnectionProvider";
import { ChoiceModal } from "../../general/ChoiceModal";
import { validate } from "uuid";
import "./JoinInputModal.css";
import { JoinPrivateProps } from "./JoinPrivate";
import shortUUID from "short-uuid";

type JoinInputModalProps = {
  onCancel: () => void;
} & JoinPrivateProps;

export function JoinInputModal({ joining, setJoining, onCancel }: JoinInputModalProps) {
  const { stompClient } = useConnection();
  const [gameId, setGameId] = useState<string>("");
  const [message, setMessage] = useState<string>("");

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
    const convertedID = shortUUID().toUUID(gameId);
    if (!validate(convertedID)) {
      setMessage("ID format not valid.");
      return;
    }
    stompClient.send("/app/join-private", {}, convertedID);
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
