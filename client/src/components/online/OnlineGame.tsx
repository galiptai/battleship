import { useCallback, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client, Frame, Message, over } from "stompjs";

export function OnlineGame() {
  const [roomUrl, setRoomUrl] = useState<string>("game");
  const [connected, setConnected] = useState<boolean>(false);
  const stompClient = useRef<Client | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const onConnected = useCallback(() => {
    setConnected(true);
    stompClient.current?.subscribe("/game", onMessageRecieved);
  }, []);

  const connect = useCallback(() => {
    if (!stompClient.current) {
      const sock = new SockJS("http://localhost:8080/ws");
      stompClient.current = over(sock);
      stompClient.current.connect({}, onConnected, onError);
      console.log("connected");
    }
  }, [onConnected]);

  useEffect(() => {
    console.log("useEffect");
    connect();
  }, [connect]);

  function onError() {
    console.error("Oops!");
  }

  function onMessageRecieved(message: Message) {
    const payloadData = message.body;
    console.log(payloadData);
    setMessages((messages) => {
      console.log(messages);
      messages.push(payloadData);
      return [...messages];
    });
  }

  function send() {
    if (stompClient.current) {
      stompClient.current.send("/app/test", {}, "Apple");
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
