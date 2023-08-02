import { useCallback, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client, Message, over } from "stompjs";
import { getId } from "../../logic/identification";
import { Joining } from "./Joining";

export function OnlineGame() {
  const [connected, setConnected] = useState<boolean>(false);
  const stompClient = useRef<Client | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const connect = useCallback(() => {
    if (!stompClient.current) {
      const sock = new SockJS("http://localhost:8080/ws");
      stompClient.current = over(sock);
    }
    if (!stompClient.current.connected) {
      stompClient.current.connect({ userId: getId() }, onConnected, onError);
    }
  }, []);

  useEffect(() => {
    connect();
  }, [connect]);

  function onError() {
    setConnected(false);
    console.error("Failed to connect.");
  }

  function onConnected() {
    setConnected(true);
  }

  function onMessageRecieved(message: Message) {
    const payloadData = message.body;
    setMessages((messages) => {
      const newMessages = [...messages];
      newMessages.push(payloadData);
      return newMessages;
    });
  }

  function send() {
    if (stompClient.current) {
      stompClient.current.send("/app/test", { userId: getId() }, "Apple");
    }
  }

  function clear() {
    setMessages([]);
  }

  function join() {
    if (stompClient.current) {
      stompClient.current.send("/app/join", { userId: getId() });
    }
  }

  if (!connected) {
    return <div>Connecting...</div>;
  } else if (gameId === null && stompClient.current) {
    return <Joining stompClient={stompClient.current} setGameId={setGameId} />;
  } else {
    return <div>GAME</div>;
  }

  return (
    <div>
      <div>Connected!</div>
      <div>
        <button onClick={send}>Test</button>
        <button onClick={clear}>Clear</button>
        <button onClick={join}>Join</button>
        {messages.map((message, i) => (
          <div key={i}>{message}</div>
        ))}
      </div>
    </div>
  );
}
