import { useCallback, useEffect, useState } from "react";
import { Client, Message } from "stompjs";
import { getId } from "../../logic/identification";
import { Choice } from "../local/LocalLoader";
import { MessageOverlay } from "../general/MessageOverlay";
import { Loading } from "../general/Loading";
import { ChoiceModal } from "../general/ChoiceModal";

type JoinData = {
  joinable: boolean;
  gameId: string;
};

type JoiningProps = {
  stompClient: Client;
  setGameId: (gameId: string | null) => void;
};

const STORAGE_GAME_ID_KEY = "gameId";

export function Joining({ stompClient, setGameId }: JoiningProps) {
  const [displayRejoinModal, setDisplayRejoinModal] = useState<boolean>(false);
  const [rejoin, setRejoin] = useState<Choice>("Undecided");
  const [receivedGameId, setReceivedGameID] = useState<string | null>(null);

  const onJoinMessageReceived = useCallback(
    (message: Message) => {
      const joinData = JSON.parse(message.body) as JoinData;
      if (!joinData.joinable) {
        localStorage.removeItem(STORAGE_GAME_ID_KEY);
        stompClient.send("/app/join/new");
      } else {
        setReceivedGameID(joinData.gameId);
      }
    },
    [stompClient]
  );

  const join = useCallback(() => {
    const gameId = localStorage.getItem(STORAGE_GAME_ID_KEY);
    if (gameId) {
      stompClient.send("/app/join/rejoin", { gameId });
    } else {
      stompClient.send("/app/join/new");
    }
  }, [stompClient]);

  useEffect(() => {
    const subscription = stompClient.subscribe(`/user/${getId()}/join`, onJoinMessageReceived);
    const timer = setTimeout(() => join(), 500);
    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [stompClient, join, onJoinMessageReceived]);

  useEffect(() => {
    if (receivedGameId) {
      if (receivedGameId === localStorage.getItem(STORAGE_GAME_ID_KEY)) {
        switch (rejoin) {
          case "Undecided":
            setDisplayRejoinModal(true);
            return;
          case "Yes":
            setGameId(receivedGameId);
            return;
          case "No":
            localStorage.removeItem(STORAGE_GAME_ID_KEY);
            stompClient.send("/app/forfeit", { userId: getId(), gameId: receivedGameId });
            join();
        }
      } else {
        localStorage.setItem(STORAGE_GAME_ID_KEY, receivedGameId);
        setGameId(receivedGameId);
      }
    }
  }, [receivedGameId, rejoin, setGameId, join, stompClient]);

  return (
    <>
      <MessageOverlay display message="Searching" description={<Loading />} />
      <ChoiceModal
        display={displayRejoinModal}
        question="Running unfinished game found. Rejoin?"
        description='Picking "NO" will forfeit the running game.'
        onConfirm={() => setRejoin("Yes")}
        onCancel={() => setRejoin("No")}
      />
    </>
  );
}
