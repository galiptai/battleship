import { useCallback, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client, over } from "stompjs";
import { getId } from "../../logic/identification";
import { Joining } from "./Joining";
import { OnlineGame } from "./OnlineGame";

export function Connection() {
  const [connected, setConnected] = useState<boolean>(false);
  const stompClient = useRef<Client | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);

  const connect = useCallback(() => {
    if (!stompClient.current) {
      const sock = new SockJS(`http://${import.meta.env.VITE_DOMAIN}:8080/ws`);
      stompClient.current = over(sock);
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

  function onError() {
    setConnected(false);
    console.error("Failed to connect.");
  }

  function onConnected() {
    setConnected(true);
  }

  if (!connected) {
    return <div>Connecting...</div>;
  } else if (gameId === null && stompClient.current) {
    return <Joining stompClient={stompClient.current} setGameId={setGameId} />;
  } else if (gameId !== null && stompClient.current) {
    return <OnlineGame stompClient={stompClient.current} gameId={gameId} />;
  } else {
    return <div>Something went wrong, please reload the page.</div>;
  }
}
