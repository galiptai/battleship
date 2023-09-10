import { useState } from "react";
import { Loading } from "../../general/Loading";
import { MessageOverlay } from "../../general/MessageOverlay";
import { useConnection } from "../ConnectionProvider";
import { JoinInputModal } from "./JoinInputModal";
import { Menu } from "../../general/Menu";

type StartMode = "CREATE" | "JOIN";

export function JoinPrivate() {
  const { stompClient } = useConnection();
  const [startMode, setStartMode] = useState<StartMode | null>(null);

  function onCreateClick() {
    setStartMode("CREATE");
    stompClient.publish({ destination: "/app/create-private" });
  }

  if (startMode !== "CREATE") {
    return (
      <>
        <Menu
          title="Private Game"
          options={[
            <div onClick={onCreateClick}>Start new game</div>,
            <div onClick={() => setStartMode("JOIN")}>Join game</div>,
          ]}
        />
        {startMode === "JOIN" && <JoinInputModal onCancel={() => setStartMode(null)} />}
      </>
    );
  } else {
    return <MessageOverlay display message="Creating" description={<Loading />} />;
  }
}
