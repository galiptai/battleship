import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Message } from "@stomp/stompjs";
import { CustomError, isErrorMessage } from "../../logic/CustomError";
import { PlainShipData } from "../../logic/GameSave";
import { OnlineGame } from "../../logic/OnlineGame";
import { Guess } from "../../logic/gameLogic";
import { getId } from "../../logic/storageFunctions";
import { Coordinate } from "../gameplay/DrawBoard";
import { PlayMenu } from "../gameplay/PlayMenu";
import { PlayScreen } from "../gameplay/PlayScreen";
import { MessageOverlay } from "../general/MessageOverlay";
import { useConnection } from "./ConnectionProvider";

type GuessSunk = {
  guess: Guess;
  ship: PlainShipData;
};

export type OnlinePlayProps = {
  game: OnlineGame;
  setGame: React.Dispatch<React.SetStateAction<OnlineGame | null>>;
  updateMessage: string | null;
  displayError: (error: unknown) => void;
};

export function OnlinePlay({ game, setGame, updateMessage, displayError }: OnlinePlayProps) {
  const { stompClient } = useConnection();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const isPlayersTurn: boolean =
    (game.gameState === "P1_TURN" && game.playerIs === "PLAYER1") ||
    (game.gameState === "P2_TURN" && game.playerIs === "PLAYER2");

  const onGuessReceived = useCallback(
    (message: Message) => {
      const guess = JSON.parse(message.body) as Guess;
      setGame((game) => {
        const newGame = game!.makeCopy();
        newGame.processGuess(guess);
        return newGame;
      });
    },
    [setGame]
  );

  const onGuessSunkReceived = useCallback(
    (message: Message) => {
      const { guess, ship } = JSON.parse(message.body) as GuessSunk;
      setGame((game) => {
        const newGame = game!.makeCopy();
        newGame.processGuessSunk(guess, ship);
        return newGame;
      });
    },
    [setGame]
  );

  useEffect(() => {
    const guessSub = stompClient.subscribe(`/game/${game.id}/guess`, onGuessReceived);
    const guessUserSub = stompClient.subscribe(`/user/${getId()}/game/guess`, onGuessReceived);
    const guessSunkSub = stompClient.subscribe(
      `/user/${getId()}/game/guess_sunk`,
      onGuessSunkReceived
    );

    return () => {
      guessSub.unsubscribe();
      guessUserSub.unsubscribe();
      guessSunkSub.unsubscribe();
    };
  }, [stompClient, game.id, onGuessReceived, onGuessSunkReceived]);

  async function onOppBoardClick(coordinate: Coordinate) {
    if (!oppBoardClickCheck(coordinate)) {
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/v1/game/${game.id}/guess?playerId=${getId()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coordinate),
      });
      if (!res.ok) {
        const error = (await res.json()) as unknown;
        if (isErrorMessage(error)) {
          const { type, statusCode, userMessage, errorMessage } = error;
          throw new CustomError(type, statusCode, userMessage, errorMessage);
        } else {
          throw error;
        }
      }
    } catch (error: unknown) {
      if ((error as Error)?.name === "AbortError") {
        return;
      }
      displayError(error);
    }
    setSubmitting(false);
  }

  function oppBoardClickCheck(coordinate: Coordinate): boolean {
    if (!isPlayersTurn || submitting) {
      return false;
    }
    return game.canGuess(coordinate);
  }

  let gameStatusMessage: string;
  if (isPlayersTurn) {
    if (submitting) {
      gameStatusMessage = "Processing...";
    } else {
      gameStatusMessage = "It's your turn!";
    }
  } else if (game.gameState === "SUSPENDED") {
    gameStatusMessage = "Game is suspended.";
  } else if (game.gameState === "OVER") {
    gameStatusMessage = "Game is over.";
  } else {
    gameStatusMessage = "It's your opponent's turn!";
  }

  return (
    <>
      <PlayScreen
        playerBoard={game.getPlayerBoard()!}
        opponentBoard={game.getOpponentBoard()!}
        onOppBoardClick={onOppBoardClick}
        oppBoardClickCheck={oppBoardClickCheck}
        playMenu={
          <PlayMenu
            guesses={game.guesses}
            player1={game.player1!.player}
            player2={game.player2!.player}
            info={gameStatusMessage}
          />
        }
      />
      <MessageOverlay
        display={game.gameState === "SUSPENDED"}
        background
        message={updateMessage ? "Game suspended." : "Loading..."}
        description={updateMessage ? updateMessage : undefined}
        buttons={
          updateMessage ? [<button onClick={() => navigate("/")}>MAIN MENU</button>] : undefined
        }
      />
    </>
  );
}
