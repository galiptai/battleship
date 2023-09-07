import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getId } from "../../logic/storageFunctions";
import { Loading } from "../general/Loading";
import { MessageOverlay } from "../general/MessageOverlay";
import { Client, IFrame } from "@stomp/stompjs";

type ConnectionContextType = {
  stompClient: Client;
  connected: boolean;
};

const ConnectionContext = createContext<ConnectionContextType>(null!);

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const stompClient = useRef<Client | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const onConnected = useCallback(() => {
    setConnected(true);
    setConnectionError(null);
  }, []);

  const connect = useCallback(() => {
    if (!stompClient.current) {
      stompClient.current = new Client({
        brokerURL: `ws://${import.meta.env.VITE_ADDRESS}/ws`,
        connectHeaders: {
          userId: getId(),
        },
        reconnectDelay: 0,
        debug: import.meta.env.PROD
          ? undefined
          : function (str) {
              console.log(str);
            },
        onConnect: onConnected,
        onStompError: onError,
        onWebSocketError: onError,
      });
    }
    if (!stompClient.current.connected) {
      stompClient.current.activate();
    }
  }, [onConnected]);

  useEffect(() => {
    connect();

    return () => {
      void stompClient.current?.deactivate();
    };
  }, [connect]);

  function onError(error: IFrame | Event) {
    setConnected(false);
    console.error(error);
    let message = "Connection error.";
    if (!(error instanceof Event) && error.headers.message) {
      message = error.headers.message;
    }
    setConnectionError((error) => {
      if (!error) {
        return message;
      } else {
        return error;
      }
    });
  }

  if (!connected) {
    if (connectionError) {
      return <MessageOverlay display message="Failed to connect" description={connectionError} />;
    } else {
      return <MessageOverlay display message="Connecting" description={<Loading />} />;
    }
  } else if (connected && stompClient.current) {
    const value = { connected, stompClient: stompClient.current };
    return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
  } else {
    return <MessageOverlay display message="Something went wrong, please reload the page." />;
  }
}

export function useConnection() {
  return useContext(ConnectionContext);
}
