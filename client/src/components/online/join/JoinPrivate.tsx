import { useState } from "react";
import { Loading } from "../../general/Loading";
import { MessageOverlay } from "../../general/MessageOverlay";
import { useConnection } from "../ConnectionProvider";

type StartMode = "CREATE" | "JOIN";

export function JoinPrivate() {
  const { stompClient } = useConnection();
  const [startMode, setStartMode] = useState<StartMode | null>(null);

  function onCreateClick() {
    setStartMode("CREATE");
    stompClient.send("/app/create-private");
  }

  if (startMode === null) {
    return (
      <div>
        <div>Private game</div>
        <div onClick={onCreateClick}>Start new game</div>
        <div onClick={() => setStartMode("JOIN")}>Join game</div>
      </div>
    );
  }
  if (startMode === "CREATE") {
    return <MessageOverlay display message="Creating" description={<Loading />} />;
  } else {
    return <JoinInput />;
  }
}

function JoinInput() {
  const { stompClient } = useConnection();
  const [gameId, setGameId] = useState<string>("");

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setGameId(event.target.value);
  }

  function onFocus(event: React.FocusEvent<HTMLInputElement>) {
    event.target.select();
  }

  function join() {
    stompClient.send("/app/join-private", {}, gameId);
  }

  return (
    <div>
      <input
        type="text"
        value={gameId}
        onChange={onChange}
        onFocus={onFocus}
        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key === "Enter") {
            join();
          }
        }}
      />
      <button onClick={join}>JOIN</button>
    </div>
  );
}
