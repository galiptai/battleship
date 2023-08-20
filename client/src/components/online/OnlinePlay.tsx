import { useCallback, useEffect, useState } from "react";
import { Board } from "../../logic/Board";
import { PlayScreen } from "../gameplay/PlayScreen";
import { PlayMenu } from "../gameplay/PlayMenu";
import { Guess } from "../../logic/gameLogic";
import { WhichPlayer } from "./OnlineGame";
import { Coordinate } from "../gameplay/DrawBoard";
import { getId } from "../../logic/identification";
import { Client, Message } from "stompjs";
import { PlainShipData } from "../../logic/GameSave";

type GuessSunk = {
  guess: Guess;
  ship: PlainShipData;
};

type OnlinePlayProps = {
  gameId: string;
  stompClient: Client;
  playerBoard: Board;
  setPlayerBoard: React.Dispatch<React.SetStateAction<Board | null>>;
  opponentBoard: Board;
  setOpponentBoard: React.Dispatch<React.SetStateAction<Board | null>>;
  isPlayersTurn: boolean;
  whichPlayer: WhichPlayer;
  guesses: Guess[];
  setGuesses: React.Dispatch<React.SetStateAction<Guess[]>>;
};

export function OnlinePlay({
  gameId,
  stompClient,
  playerBoard,
  setPlayerBoard,
  opponentBoard,
  setOpponentBoard,
  isPlayersTurn,
  whichPlayer,
  guesses,
  setGuesses,
}: OnlinePlayProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);

  console.log(playerBoard.ships);
  const onGuessReceived = useCallback(
    (message: Message) => {
      const guess = JSON.parse(message.body) as Guess;
      setGuesses((guesses) => [...guesses, guess]);
      if (guess.player === whichPlayer) {
        setOpponentBoard((board) => {
          const newBoard = board!.makeCopy();
          newBoard.processGuess(guess);
          return newBoard;
        });
      } else {
        setPlayerBoard((board) => {
          const newBoard = board!.makeCopy();
          newBoard.processGuess(guess);
          return newBoard;
        });
      }
    },
    [setGuesses, setPlayerBoard, setOpponentBoard, whichPlayer]
  );

  const onGuessSunkReceived = useCallback(
    (message: Message) => {
      const { guess, ship } = JSON.parse(message.body) as GuessSunk;
      setGuesses((guesses) => [...guesses, guess]);
      setOpponentBoard((board) => {
        const newBoard = board!.makeCopy();
        newBoard.processGuessSunk(guess, ship);
        return newBoard;
      });
    },
    [setGuesses, setOpponentBoard]
  );

  useEffect(() => {
    console.log("useEffect in OnlinePlay");
    const guessSub = stompClient.subscribe(`/game/${gameId}/guess`, onGuessReceived);
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
  }, [stompClient, gameId, onGuessReceived, onGuessSunkReceived]);

  async function onOppBoardClick(coordinate: Coordinate) {
    if (!oppBoardClickCheck(coordinate)) {
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`api/v1/game/${gameId}/guess?playerId=${getId()}`, {
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
    return !opponentBoard.tiles[coordinate.y][coordinate.x].guessed;
  }
  return (
    <PlayScreen
      playerBoard={playerBoard}
      opponentBoard={opponentBoard}
      onOppBoardClick={onOppBoardClick}
      oppBoardClickCheck={oppBoardClickCheck}
    >
      <PlayMenu
        guesses={guesses}
        player1={whichPlayer == "PLAYER1" ? playerBoard.player : opponentBoard.player}
        player2={whichPlayer == "PLAYER1" ? opponentBoard.player : playerBoard.player}
      ></PlayMenu>
    </PlayScreen>
  );
}
