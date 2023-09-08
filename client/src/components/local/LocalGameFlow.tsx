import { useEffect, useState } from "react";
import { Board } from "../../logic/Board";
import { GameSave } from "../../logic/GameSave";
import { LocalGame } from "../../logic/LocalGame";
import { ResultsScreen } from "../general/ResultsScreen";
import { BoardSetup } from "../setup/BoardSetup";
import { LocalPlay } from "./LocalPlay";

type LocalGameProps = {
  save: GameSave;
  updateSave: (save: GameSave) => void;
  deleteSave: () => void;
};

export function LocalGameFlow({ save, updateSave, deleteSave }: LocalGameProps) {
  const [game, setGame] = useState<LocalGame>(save.getGame());
  const [displayResults, setDisplayResults] = useState<boolean>(false);

  function setPlayer1Board(board: Board) {
    setGame((game) => {
      const newGame = game.makeCopy();
      newGame.setBoard("PLAYER1", board);
      return newGame;
    });
  }

  function setPlayer2Board(board: Board) {
    setGame((game) => {
      const newGame = game.makeCopy();
      newGame.setBoard("PLAYER2", board);
      return newGame;
    });
  }

  useEffect(() => {
    if (game.winner === null) {
      updateSave(GameSave.fromLocalGame(game, new Date()));
    } else {
      deleteSave();
    }
  }, [updateSave, game, deleteSave]);

  if (game.player1 === null) {
    return <BoardSetup key="P1" starterName={"Player 1"} setVerifiedBoard={setPlayer1Board} />;
  } else if (game.player2 === null) {
    return <BoardSetup key="P2" starterName={"Player 2"} setVerifiedBoard={setPlayer2Board} />;
  }

  if (!displayResults) {
    return <LocalPlay game={game} setGame={setGame} setDisplayResults={setDisplayResults} />;
  } else if (game.winner !== null) {
    return (
      <ResultsScreen
        p1Board={game.player1}
        p2Board={game.player2}
        winner={game.winner}
        guesses={game.guesses}
        playerIs="PLAYER1"
      />
    );
  }
}
