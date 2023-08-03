import { useCallback, useEffect, useRef, useState } from "react";
import { Client, Message } from "stompjs";
import { getId } from "../../logic/identification";
import { Choice } from "../local/LocalLoader";

type JoiningTypes = {
  stompClient: Client;
  setGameId: (gameId: string | null) => void;
};

type JoinData = {
  joinable: boolean;
  gameId: string;
};

const STORAGE_GAME_ID_KEY = "gameId";

export function Joining({ stompClient, setGameId }: JoiningTypes) {
  const [displayRejoinModal, setDisplayRejoinModal] = useState<boolean>(false);
  const [rejoin, setRejoin] = useState<Choice>("Undecided");
  const [receivedGameId, setReceivedGameID] = useState<string | null>(null);
  const componentDidMount = useRef<boolean>(false);

  const onJoinMessageReceived = useCallback(
    (message: Message) => {
      const joinData = JSON.parse(message.body) as JoinData;
      console.log(joinData);
      if (!joinData.joinable) {
        localStorage.removeItem(STORAGE_GAME_ID_KEY);
        stompClient.send("/app/join/new", { userId: getId() });
      } else {
        setReceivedGameID(joinData.gameId);
      }
    },
    [stompClient]
  );

  const join = useCallback(() => {
    const gameId = localStorage.getItem(STORAGE_GAME_ID_KEY);
    if (gameId) {
      stompClient.send("/app/join/rejoin", { userId: getId(), gameId });
    } else {
      stompClient.send("/app/join/new", { userId: getId() });
    }
  }, [stompClient]);

  useEffect(() => {
    const subscription = stompClient.subscribe(`/user/${getId()}/join`, onJoinMessageReceived);
    console.log(componentDidMount.current);
    if (!componentDidMount.current) {
      join();
      componentDidMount.current = true;
    }
    return () => {
      subscription.unsubscribe();
    };
  }, [stompClient, join, onJoinMessageReceived]);

  useEffect(() => {
    if (receivedGameId) {
      console.log("set");
      if (receivedGameId === localStorage.getItem(STORAGE_GAME_ID_KEY)) {
        console.log(rejoin);
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
      {displayRejoinModal && (
        <ChoiceModal
          question="Running unfinished game found. Rejoin?"
          onConfirm={() => setRejoin("Yes")}
          onCancel={() => setRejoin("No")}
        />
      )}
      <div>
        <div>Joining...</div>
      </div>
    </>
  );
}

type ChoiceModalProps = {
  question: string;
  onConfirm: () => void;
  onCancel: () => void;
};

function ChoiceModal({ question, onConfirm, onCancel }: ChoiceModalProps) {
  return (
    <div>
      <div>{question}</div>
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onCancel}>No</button>
    </div>
  );
}