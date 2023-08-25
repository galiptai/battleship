import { useCallback, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client, Frame, over } from "stompjs";
import { getId } from "../../logic/identification";
import { Joining } from "./Joining";
import { OnlineGame } from "./OnlineGame";
import { MessageOverlay } from "../general/MessageOverlay";
import { Loading } from "../general/Loading";

export type ErrorMessage = {
  message: string;
};

export function Connection() {
  const stompClient = useRef<Client | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [gameId, setGameId] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const connect = useCallback(() => {
    if (!stompClient.current) {
      const sock = new SockJS(`http://${import.meta.env.VITE_DOMAIN}/ws`);
      stompClient.current = over(sock);
      if (import.meta.env.PROD) {
        stompClient.current.debug = () => {
          return;
        };
      }
    }
    if (!stompClient.current.connected) {
      stompClient.current.connect({ userId: getId() }, onConnected, onError);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (stompClient.current?.connected) {
        stompClient.current.disconnect(() => undefined);
      }
    };
  }, [connect]);

  function onError(error: string | Frame) {
    setConnected(false);
    console.error(error);
    setConnectionError("Failed to connect.");
  }

  function onConnected() {
    setConnected(true);
    setConnectionError(null);
  }

  if (!connected) {
    if (connectionError) {
      return <MessageOverlay display message={connectionError} />;
    } else {
      return <MessageOverlay display message="Connecting" description={<Loading />} />;
    }
  } else if (gameId === null && stompClient.current) {
    return <Joining stompClient={stompClient.current} setGameId={setGameId} />;
  } else if (gameId !== null && stompClient.current) {
    return <OnlineGame stompClient={stompClient.current} gameId={gameId} />;
  } else {
    return <MessageOverlay display message="Something went wrong, please reload the page." />;
  }
}
