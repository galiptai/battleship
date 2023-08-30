import { useCallback, useEffect, useState } from "react";
import { JoinData, JoiningProps } from "./JoinQuick";
import { getId } from "../../../logic/storageFunctions";
import { Client, Message } from "stompjs";
import { MessageOverlay } from "../../general/MessageOverlay";
import { Loading } from "../../general/Loading";

type StartMode = "CREATE" | "JOIN";

export function JoinPrivate({ stompClient, setGameId }: JoiningProps) {
  const [startMode, setStartMode] = useState<StartMode | null>(null);

  const onJoinMessageReceived = useCallback(
    (message: Message) => {
      const joinData = JSON.parse(message.body) as JoinData;
      if (joinData.joinable) {
        setGameId(joinData.gameId);
      }
    },
    [setGameId]
  );

  useEffect(() => {
    const subscription = stompClient.subscribe(`/user/${getId()}/join`, onJoinMessageReceived);
    return () => {
      subscription.unsubscribe();
    };
  }, [stompClient, onJoinMessageReceived]);

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
    return <JoinInput stompClient={stompClient} />;
  }
}

type JoinInputProps = {
  stompClient: Client;
};

function JoinInput({ stompClient }: JoinInputProps) {
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
