import { useCallback, useEffect, useState } from "react";
import { Client, Message } from "stompjs";
import { getId } from "../../logic/storageFunctions";
import { MessageOverlay } from "../general/MessageOverlay";
import { Loading } from "../general/Loading";
import { Choice, ChoiceModal } from "../general/ChoiceModal";

type JoinData = {
  joinable: boolean;
  gameId: string;
  rejoin: boolean;
};

type JoiningProps = {
  stompClient: Client;
  setGameId: (gameId: string | null) => void;
};

export function Joining({ stompClient, setGameId }: JoiningProps) {
  const [displayRejoinModal, setDisplayRejoinModal] = useState<boolean>(false);
  const [joinData, setJoinData] = useState<JoinData | null>(null);
  const [rejoin, setRejoin] = useState<Choice>("Undecided");

  const onJoinMessageReceived = useCallback((message: Message) => {
    const joinData = JSON.parse(message.body) as JoinData;
    setJoinData(joinData);
  }, []);

  const join = useCallback(() => {
    stompClient.send("/app/join");
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
    if (joinData) {
      if (joinData.rejoin) {
        switch (rejoin) {
          case "Undecided":
            setDisplayRejoinModal(true);
            return;
          case "Yes":
            setGameId(joinData.gameId);
            return;
          case "No":
            stompClient.send("/app/forfeit", { userId: getId(), gameId: joinData.gameId });
            join();
        }
      } else {
        setGameId(joinData.gameId);
      }
    }
  }, [joinData, rejoin, setGameId, join, stompClient]);

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
