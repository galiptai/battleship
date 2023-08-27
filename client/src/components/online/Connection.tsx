import { useCallback, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client, Frame, Message, over } from "stompjs";
import { getId } from "../../logic/storageFunctions";
import { Joining } from "./Joining";
import { OnlineGame } from "./OnlineGame";
import { MessageOverlay } from "../general/MessageOverlay";
import { Loading } from "../general/Loading";
import { useNavigate } from "react-router-dom";
import { CustomError, ErrorMessage } from "../../logic/CustomError";

export function Connection() {
  const navigate = useNavigate();
  const stompClient = useRef<Client | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [gameId, setGameId] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<CustomError | null>(null);

  const displayError = useCallback((error: unknown) => {
    console.error(error);
    if (error instanceof CustomError) {
      setErrorMessage(error);
    } else {
      setErrorMessage(new CustomError("ERROR", 0, "Something went wrong.", ""));
    }
  }, []);

  const onGameErrorReceived = useCallback(
    (message: Message) => {
      const { type, statusCode, userMessage, errorMessage } = JSON.parse(
        message.body
      ) as ErrorMessage;
      displayError(new CustomError(type, statusCode, userMessage, errorMessage));
    },
    [displayError]
  );

  const onConnected = useCallback(() => {
    setConnected(true);
    setConnectionError(null);
    stompClient.current!.subscribe(`/user/${getId()}/error`, onGameErrorReceived);
  }, [onGameErrorReceived]);

  const connect = useCallback(() => {
    if (!stompClient.current) {
      const sock = new SockJS(`/ws`);
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
  }, [onConnected]);

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

  if (!connected) {
    if (connectionError) {
      return <MessageOverlay display message={connectionError} />;
    } else {
      return <MessageOverlay display message="Connecting" description={<Loading />} />;
    }
  } else {
    if (stompClient.current === null) {
      return <MessageOverlay display message="Something went wrong, please reload the page." />;
    }
    return (
      <>
        {gameId === null ? (
          <Joining stompClient={stompClient.current} setGameId={setGameId} />
        ) : (
          <OnlineGame
            stompClient={stompClient.current}
            gameId={gameId}
            displayError={displayError}
          />
        )}
        {errorMessage && (
          <MessageOverlay
            display
            background
            message={`Error: ${errorMessage.userMessage}`}
            description={
              errorMessage.type === "WARNING"
                ? "If you keep getting this error, try reloading the game."
                : undefined
            }
            buttons={
              errorMessage.type === "ERROR"
                ? [<button onClick={() => navigate("/")}>MAIN MENU</button>]
                : [<button onClick={() => setErrorMessage(null)}>OK</button>]
            }
          />
        )}
      </>
    );
  }
}
