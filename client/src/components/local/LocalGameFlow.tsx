import { Dispatch, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Board } from "../../logic/Board";
import { LocalGame } from "../../logic/LocalGame";
import { MessageOverlay } from "../general/MessageOverlay";
import { ResultsScreen } from "../general/ResultsScreen";
import { BoardSetup } from "../setup/BoardSetup";
import { LocalPlay } from "./LocalPlay";
import { useSave } from "./SaveProvider";

type LocalGameFlowProps = {
  game: LocalGame;
  setGame: Dispatch<React.SetStateAction<LocalGame | null>>;
};

export function LocalGameFlow({ game, setGame }: LocalGameFlowProps) {
  const { manageSave } = useSave();
  const navigate = useNavigate();
  const [displayResults, setDisplayResults] = useState<boolean>(false);

  function setPlayer1Board(board: Board) {
    setGame((game) => {
      const newGame = game!.makeCopy();
      newGame.setBoard("PLAYER1", board);
      return newGame;
    });
  }

  function setPlayer2Board(board: Board) {
    setGame((game) => {
      const newGame = game!.makeCopy();
      newGame.setBoard("PLAYER2", board);
      manageSave(newGame);
      return newGame;
    });
  }

  if (game.player1 === null) {
    return (
      <BoardSetup
        key="P1"
        rules={game.rules}
        starterName={"Player 1"}
        setVerifiedBoard={setPlayer1Board}
      />
    );
  } else if (game.player2 === null) {
    return (
      <BoardSetup
        key="P2"
        rules={game.rules}
        starterName={"Player 2"}
        setVerifiedBoard={setPlayer2Board}
      />
    );
  }

  const over = game.winner !== null;
  if (over && displayResults) {
    return (
      <ResultsScreen
        p1Board={game.player1}
        p2Board={game.player2}
        winner={game.getWinnerName()}
        guesses={game.guesses}
        playerIs="PLAYER1"
      />
    );
  } else {
    return (
      <>
        <LocalPlay game={game} setGame={setGame} />
        {over && (
          <MessageOverlay
            display
            background
            message="You win!"
            description={`Congratulations, ${game.getWinnerName()}!`}
            buttons={[
              <button onClick={() => setDisplayResults(true)}>SEE RESULTS</button>,
              <button onClick={() => navigate("/")}>MAIN MENU</button>,
            ]}
          />
        )}
      </>
    );
  }
}
