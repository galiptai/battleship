import { useState } from "react";
import { BoardSetup } from "../setup/BoardSetup";
import { LocalGame } from "./LocalGame";
import { ResultsScreen } from "../gameplay/ResultsScreen";
import { Board } from "../../logic/Board";
import { Guess } from "../../logic/gameLogic";

export function Local() {
  const [p1Board, setP1Board] = useState<Board | null>(null);
  const [p2Board, setP2Board] = useState<Board | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);

  if (p1Board === null) {
    return <BoardSetup key="P1" starterName={"Player 1"} setVerifiedBoard={setP1Board} />;
  } else if (p2Board === null) {
    return <BoardSetup key="P2" starterName={"Player 2"} setVerifiedBoard={setP2Board} />;
  }

  if (!gameOver) {
    return (
      <LocalGame
        p1Board={p1Board}
        setP1Board={setP1Board}
        p2Board={p2Board}
        setP2Board={setP2Board}
        guesses={guesses}
        setGuesses={setGuesses}
        setGameOver={setGameOver}
      />
    );
  } else {
    let winner: string;
    if (p1Board.checkAllBoatsSank()) {
      winner = p2Board.player;
    } else {
      winner = p1Board.player;
    }
    return <ResultsScreen p1Board={p1Board} p2Board={p2Board} winner={winner} guesses={guesses} />;
  }
}
