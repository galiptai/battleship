import { Dispatch, useState } from "react";
import { Loading } from "../../general/Loading";
import { MessageOverlay } from "../../general/MessageOverlay";
import { useConnection } from "../ConnectionProvider";
import { JoinInputModal } from "./JoinInputModal";
import "./JoinPrivate.css";

type StartMode = "CREATE" | "JOIN";

export type JoinPrivateProps = {
  joining: boolean;
  setJoining: Dispatch<React.SetStateAction<boolean>>;
};

export function JoinPrivate({ joining, setJoining }: JoinPrivateProps) {
  const { stompClient } = useConnection();
  const [startMode, setStartMode] = useState<StartMode | null>(null);

  function onCreateClick() {
    setStartMode("CREATE");
    stompClient.send("/app/create-private");
  }

  if (startMode !== "CREATE") {
    return (
      <div className="join-private">
        <div className="join-private-title">Private game</div>
        <div className="join-private-options">
          <div onClick={onCreateClick}>Start new game</div>
          <div onClick={() => setStartMode("JOIN")}>Join game</div>
        </div>
        {startMode === "JOIN" && (
          <JoinInputModal
            joining={joining}
            setJoining={setJoining}
            onCancel={() => setStartMode(null)}
          />
        )}
      </div>
    );
  } else {
    return <MessageOverlay display message="Creating" description={<Loading />} />;
  }
}
