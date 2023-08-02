import { useCallback, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client, Message, over } from "stompjs";
import { getId } from "../../logic/identification";

export function OnlineGame() {
  const [room, setRoom] = useState<string>("game");
  const [connected, setConnected] = useState<boolean>(false);
  const stompClient = useRef<Client | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const onConnected = useCallback(() => {
    setConnected(true);
    stompClient.current?.subscribe(`/${room}`, onMessageRecieved);
  }, [room]);

  const connect = useCallback(() => {
    if (!stompClient.current) {
      const sock = new SockJS("http://localhost:8080/ws");
      stompClient.current = over(sock);
    }
    if (!stompClient.current.connected) {
      stompClient.current.connect({ userId: getId() }, onConnected, onError);
    }
  }, [onConnected]);

  useEffect(() => {
    connect();
  }, [connect]);

  function onError() {
    console.error("Failed to connect.");
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
      stompClient.current.send("/app/test", { id: getId() }, "Apple");
    }
  }

  function clear() {
    setMessages([]);
  }

  if (!connected) {
    return <div>Connecting...</div>;
  }

  return (
    <div>
      <div>Connected!</div>
      <div>
        <button onClick={send}>Test</button>
        <button onClick={clear}>Clear</button>
        {messages.map((message, i) => (
          <div key={i}>{message}</div>
        ))}
      </div>
    </div>
  );
}
