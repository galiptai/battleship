import { useEffect, useState, useRef } from "react";
import { BoardSetup } from "../setup/BoardSetup";
import { LocalPlay } from "./LocalPlay";
import { ResultsScreen } from "../gameplay/ResultsScreen";
import { Board } from "../../logic/Board";
import { Guess } from "../../logic/gameLogic";
import { GameSave } from "../../logic/GameSave";

type LocalGameProps = {
  save: GameSave;
  updateSave: (save: GameSave) => void;
  deleteSave: () => void;
};

export function LocalGame({ save, updateSave, deleteSave }: LocalGameProps) {
  const [p1Board, setP1Board] = useState<Board | null>(save.getP1Board());
  const [p2Board, setP2Board] = useState<Board | null>(save.getP2Board());
  const [guesses, setGuesses] = useState<Guess[]>(save.guesses);
  const [winner, setWinner] = useState<string | null>(null);
  const [displayResults, setDisplayResults] = useState<boolean>(false);
  const componentDidMount = useRef<boolean>(false);

  useEffect(() => {
    if (componentDidMount.current) {
      if (winner == null) {
        updateSave(GameSave.fromGameObjects(p1Board, p2Board, guesses, new Date()));
      } else {
        deleteSave();
      }
    } else {
      componentDidMount.current = true;
    }
  }, [updateSave, p1Board, p2Board, guesses, winner, deleteSave]);

  if (p1Board === null) {
    return <BoardSetup key="P1" starterName={"Player 1"} setVerifiedBoard={setP1Board} />;
  } else if (p2Board === null) {
    return <BoardSetup key="P2" starterName={"Player 2"} setVerifiedBoard={setP2Board} />;
  }

  if (!displayResults) {
    return (
      <LocalPlay
        p1Board={p1Board}
        setP1Board={setP1Board}
        p2Board={p2Board}
        setP2Board={setP2Board}
        guesses={guesses}
        setGuesses={setGuesses}
        setDisplayResults={setDisplayResults}
        p1Starts={save.getP1TurnNext()}
        winner={winner}
        setWinner={setWinner}
      />
    );
  } else if (winner) {
    return <ResultsScreen p1Board={p1Board} p2Board={p2Board} winner={winner} guesses={guesses} />;
  }
}
