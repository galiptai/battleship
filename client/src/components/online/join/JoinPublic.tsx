import { useEffect, useRef } from "react";
import { Loading } from "../../general/Loading";
import { MessageOverlay } from "../../general/MessageOverlay";
import { useConnection } from "../ConnectionProvider";

export type JoiningProps = {
  joinSubscribed: boolean;
};

export function JoinPublic({ joinSubscribed }: JoiningProps) {
  const { stompClient } = useConnection();
  const joinRequestSent = useRef<boolean>(false);

  useEffect(() => {
    if (joinSubscribed && !joinRequestSent.current) {
      stompClient.send("/app/join");
      joinRequestSent.current = true;
    }
  }, [stompClient, joinSubscribed]);

  return <MessageOverlay display message="Searching" description={<Loading />} />;
}
