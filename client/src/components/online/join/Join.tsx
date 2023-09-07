import { Dispatch, useCallback, useEffect, useState } from "react";
import { Message } from "@stomp/stompjs";
import { getId } from "../../../logic/storageFunctions";
import { useConnection } from "../ConnectionProvider";
import { JoinPrivate } from "./JoinPrivate";
import { JoinPublic } from "./JoinPublic";
import { Rejoin } from "./Rejoin";
import shortUUID from "short-uuid";

export type ConfirmSub = {
  receiptId: string;
  confirmed: boolean;
};

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
  const [joinSubConfirm, setJoinSubConfirm] = useState<ConfirmSub>({
    receiptId: "",
    confirmed: false,
  });
  const [rejoinCheck, setRejoinCheck] = useState<boolean>(false);
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
    },
    [setGameId]
  );

  useEffect(() => {
    const receiptId = shortUUID().generate().toString();
    stompClient.watchForReceipt(receiptId, () => {
      setJoinSubConfirm((subscribed) => {
        if (receiptId === subscribed.receiptId) {
          return { receiptId, confirmed: true };
        } else {
          return subscribed;
        }
      });
    });
    const subscription = stompClient.subscribe(`/user/${getId()}/join`, onJoinMessageReceived, {
      receipt: receiptId,
    });
    setJoinSubConfirm({ receiptId, confirmed: false });
    return () => {
      subscription.unsubscribe();
      setJoinSubConfirm({ receiptId: "", confirmed: false });
    };
  }, [stompClient, onJoinMessageReceived]);

  function onRejoinAccept() {
    setGameId(joinData!.gameId);
  }

  function onRejoinDecline() {
    stompClient.publish({ destination: "/app/forfeit", body: joinData!.gameId });
    setRejoinCheck(true);
  }

  if (!rejoinCheck) {
    return (
      <Rejoin
        joinSubscribed={joinSubConfirm.confirmed}
        rejoinData={joinData}
        onRejoinAccept={onRejoinAccept}
        onRejoinDecline={onRejoinDecline}
      />
    );
  } else {
    if (joinMode === "PRIVATE") {
      return <JoinPrivate />;
    } else {
      return <JoinPublic joinSubscribed={joinSubConfirm.confirmed} />;
    }
  }
}
