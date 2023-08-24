import { useCallback, useEffect, useState } from "react";
import { PlayScreen } from "../gameplay/PlayScreen";
import { PlayMenu } from "../gameplay/PlayMenu";
import { Guess } from "../../logic/gameLogic";
import { Coordinate } from "../gameplay/DrawBoard";
import { getId } from "../../logic/identification";
import { Client, Message } from "stompjs";
import { PlainShipData } from "../../logic/GameSave";
import { OnlineGame } from "../../logic/OnlineGame";
import { MessageOverlay } from "../general/MessageOverlay";
import { useNavigate } from "react-router-dom";

type GuessSunk = {
  guess: Guess;
  ship: PlainShipData;
};

type OnlinePlayProps = {
  stompClient: Client;
  game: OnlineGame;
  setGame: React.Dispatch<React.SetStateAction<OnlineGame | null>>;
  updateMessage: string | null;
};

export function OnlinePlay({ stompClient, game, setGame, updateMessage }: OnlinePlayProps) {
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
        newGame.guesses = [...newGame.guesses, guess];
        if (newGame.playerIs === guess.player) {
          newGame.opponent!.processGuess(guess);
        } else {
          newGame.player!.processGuess(guess);
        }
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
        newGame.guesses = [...newGame.guesses, guess];
        newGame.opponent!.processGuessSunk(guess, ship);
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
      const res = await fetch(`api/v1/game/${game.id}/guess?playerId=${getId()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coordinate),
      });
      if (!res.ok) {
        const data = (await res.json()) as { detail?: string };
        if (data.detail) {
          console.error(data.detail);
        }
      }
    } catch (error) {
      console.error(error);
    }
    setSubmitting(false);
  }

  function oppBoardClickCheck(coordinate: Coordinate): boolean {
    if (!isPlayersTurn || submitting) {
      return false;
    }
    return !game.opponent!.tiles[coordinate.y][coordinate.x].guessed;
  }

  return (
    <>
      <PlayScreen
        playerBoard={game.player!}
        opponentBoard={game.opponent!}
        onOppBoardClick={onOppBoardClick}
        oppBoardClickCheck={oppBoardClickCheck}
        playMenu={
          <PlayMenu
            guesses={game.guesses}
            player1={game.playerIs === "PLAYER1" ? game.player!.player : game.opponent!.player}
            player2={game.playerIs === "PLAYER1" ? game.opponent!.player : game.player!.player}
            isPlayersTurn={isPlayersTurn}
          />
        }
      />
      <MessageOverlay
        display={game.gameState === "SUSPENDED"}
        message={updateMessage ? "Game suspended." : "Loading..."}
        description={updateMessage ? updateMessage : undefined}
        buttons={
          updateMessage ? [<button onClick={() => navigate("/")}>MAIN MENU</button>] : undefined
        }
      />
    </>
  );
}
