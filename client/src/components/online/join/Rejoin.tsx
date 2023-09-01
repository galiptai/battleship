import { Dispatch, useEffect, useRef, useState } from "react";
import { Loading } from "../../general/Loading";
import { MessageOverlay } from "../../general/MessageOverlay";
import { useConnection } from "../ConnectionProvider";
import { JoinData } from "./Join";
import { ChoiceModal } from "../../general/ChoiceModal";

export type RejoinProps = {
  joinSubscribed: boolean;
  rejoinData: JoinData | null;
  onRejoinAccept: () => void;
  onRejoinDecline: () => void;
};

export function Rejoin({
  joinSubscribed,
  rejoinData,
  onRejoinAccept,
  onRejoinDecline,
}: RejoinProps) {
  const { stompClient } = useConnection();
  const rejoinRequestSent = useRef<boolean>(false);

  useEffect(() => {
    if (joinSubscribed && !rejoinRequestSent.current) {
      stompClient.send("/app/rejoin");
      rejoinRequestSent.current = true;
    }
  }, [stompClient, joinSubscribed]);

  return (
    <>
      <MessageOverlay display message="Checking for unfinished games" description={<Loading />} />
      {rejoinData && (
        <ChoiceModal
          display
          question="Running unfinished game found. Rejoin?"
          description='Picking "NO" will forfeit the running game.'
          onConfirm={onRejoinAccept}
          onCancel={onRejoinDecline}
        />
      )}
    </>
  );
}