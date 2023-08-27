import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageOverlay } from "../general/MessageOverlay";
import { OnlinePlay, OnlinePlayProps } from "./OnlinePlay";
import { ResultsScreen } from "../general/ResultsScreen";
import { deleteGameId } from "../../logic/storageFunctions";

type OnlineOverProps = OnlinePlayProps;

export function OnlineOver({
  stompClient,
  game,
  setGame,
  updateMessage,
  displayError,
}: OnlineOverProps) {
  const [displayResults, setDisplayResults] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    deleteGameId();
  }, []);

  if (game.winner) {
    if (displayResults) {
      return (
        <ResultsScreen
          winner={game.getWinnerName()}
          p1Board={game.player!}
          p2Board={game.opponent!}
          guesses={game.guesses}
          playerIs={game.playerIs}
        />
      );
    } else {
      let description: string;
      if (updateMessage) {
        description = updateMessage;
      } else {
        if (game.playerIsWinner()) {
          description = "Congratulations!";
        } else {
          description = "Better luck next time!";
        }
      }
      return (
        <>
          <OnlinePlay
            stompClient={stompClient}
            game={game}
            setGame={setGame}
            updateMessage={updateMessage}
            displayError={displayError}
          />
          <MessageOverlay
            display
            background
            message={`${game.getWinnerName()} won!`}
            description={description}
            buttons={[
              <button onClick={() => setDisplayResults(true)}>SEE RESULTS</button>,
              <button onClick={() => navigate("/")}>MAIN MENU</button>,
            ]}
          />
        </>
      );
    }
  } else {
    return (
      <MessageOverlay
        display
        message="Game cancelled."
        description={updateMessage ? updateMessage : undefined}
        buttons={[<button onClick={() => navigate("/")}>MAIN MENU</button>]}
      />
    );
  }
}
