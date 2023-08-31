import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import SockJS from "sockjs-client";
import { Client, Frame, over } from "stompjs";
import { getId } from "../../logic/storageFunctions";
import { Loading } from "../general/Loading";
import { MessageOverlay } from "../general/MessageOverlay";

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
    let message = "Connection error.";
    if (((error as Frame)?.headers as { [key: string]: string })?.message) {
      message = ((error as Frame)?.headers as { [key: string]: string })?.message;
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
