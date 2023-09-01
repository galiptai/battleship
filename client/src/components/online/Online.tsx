import { useCallback, useEffect, useState } from "react";
import { useConnection } from "./ConnectionProvider";
import { Join, JoinMode } from "./join/Join";
import { OnlineGameFlow } from "./OnlineGameFlow";
import { CustomError, ErrorMessage } from "../../logic/CustomError";
import { Message } from "stompjs";
import { getId } from "../../logic/storageFunctions";
import { MessageOverlay } from "../general/MessageOverlay";
import { useNavigate } from "react-router-dom";

type OnlineProps = {
  joinMode: JoinMode;
};

export function Online({ joinMode }: OnlineProps) {
  const { stompClient } = useConnection();
  const navigate = useNavigate();
  const [gameId, setGameId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<CustomError | null>(null);

  const displayError = useCallback((error: unknown) => {
    console.error(error);
    if (error instanceof CustomError) {
      setErrorMessage(error);
    } else {
      setErrorMessage(new CustomError("ERROR", 0, "Something went wrong.", ""));
    }
  }, []);

  const onErrorReceived = useCallback(
    (message: Message) => {
      const { type, statusCode, userMessage, errorMessage } = JSON.parse(
        message.body
      ) as ErrorMessage;
      displayError(new CustomError(type, statusCode, userMessage, errorMessage));
    },
    [displayError]
  );

  useEffect(() => {
    const errorSub = stompClient.subscribe(`/user/${getId()}/error`, onErrorReceived);

    return () => errorSub.unsubscribe();
  }, [stompClient, onErrorReceived]);

  return (
    <>
      {gameId === null ? (
        <Join joinMode={joinMode} setGameId={setGameId} />
      ) : (
        <OnlineGameFlow gameId={gameId} displayError={displayError} />
      )}
      {errorMessage && (
        <MessageOverlay
          display
          background
          message={`Error: ${errorMessage.userMessage}`}
          buttons={
            errorMessage.type === "ERROR"
              ? [<button onClick={() => navigate("/")}>MAIN MENU</button>]
              : [<button onClick={() => setErrorMessage(null)}>OK</button>]
          }
          zIndex={400}
        />
      )}
    </>
  );
}
