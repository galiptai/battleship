import { Dispatch, useCallback, useEffect, useState } from "react";
import { Message } from "stompjs";
import { getId } from "../../../logic/storageFunctions";
import { useConnection } from "../ConnectionProvider";
import { JoinPrivate } from "./JoinPrivate";
import { JoinPublic } from "./JoinPublic";
import { Rejoin } from "./Rejoin";

export type JoinMode = "PUBLIC" | "PRIVATE";

export type JoinData = {
  joinable: boolean;
  gameId: string;
  rejoin: boolean;
};

type JoinProps = {
  joinMode: JoinMode;
  setGameId: Dispatch<React.SetStateAction<string | null>>;
};

export function Join({ joinMode, setGameId }: JoinProps) {
  const { stompClient } = useConnection();
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [rejoinCheck, setRejoinCheck] = useState<boolean>(false);
  const [joining, setJoining] = useState<boolean>(false);
  const [joinData, setRejoinData] = useState<JoinData | null>(null);

  const onJoinMessageReceived = useCallback(
    (message: Message) => {
      const joinData = JSON.parse(message.body) as JoinData;
      if (joinData.rejoin) {
        if (joinData.joinable) {
          setRejoinData(joinData);
        } else {
          setRejoinCheck(true);
        }
      } else {
        setGameId(joinData.gameId);
      }
      setJoining(false);
    },
    [setGameId]
  );

  useEffect(() => {
    const subscription = stompClient.subscribe(`/user/${getId()}/join`, onJoinMessageReceived);
    const subscription2 = stompClient.subscribe(`/topic`, onJoinMessageReceived);
    setSubscribed(true);
    return () => {
      subscription.unsubscribe();
      subscription2.unsubscribe();
      setSubscribed(false);
    };
  }, [stompClient, onJoinMessageReceived]);

  function onRejoinAccept() {
    setGameId(joinData!.gameId);
  }

  function onRejoinDecline() {
    stompClient.send("/app/forfeit", {}, joinData!.gameId);
    setRejoinCheck(true);
  }

  if (!rejoinCheck) {
    return (
      <Rejoin
        joinSubscribed={subscribed}
        rejoinData={joinData}
        onRejoinAccept={onRejoinAccept}
        onRejoinDecline={onRejoinDecline}
      />
    );
  } else {
    if (joinMode === "PRIVATE") {
      return <JoinPrivate joining={joining} setJoining={setJoining} />;
    } else {
      return <JoinPublic joinSubscribed={subscribed} />;
    }
  }
}
