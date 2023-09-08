import { Dispatch, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocalGame } from "../../logic/LocalGame";
import { Coordinate } from "../gameplay/DrawBoard";
import { PlayMenu } from "../gameplay/PlayMenu";
import { PlayScreen } from "../gameplay/PlayScreen";
import { MessageOverlay } from "../general/MessageOverlay";

type LocalPlayProps = {
  game: LocalGame;
  setGame: Dispatch<React.SetStateAction<LocalGame>>;
  setDisplayResults: (displayResults: boolean) => void;
};

export function LocalPlay({ game, setGame, setDisplayResults }: LocalPlayProps) {
  const navigate = useNavigate();
  const [displaySwitch, setDisplaySwitch] = useState<boolean>(true);
  const [canGuess, setCanGuess] = useState<boolean>(false);

  const playerBoard = game.currentTurn === "PLAYER1" ? game.player1! : game.player2!;
  const opponentBoard = game.currentTurn === "PLAYER1" ? game.player2! : game.player1!;
  const over = game.winner !== null;

  function onOppBoardClick(coordinate: Coordinate) {
    if (!canGuess || !oppBoardClickCheck(coordinate)) {
      return;
    }
    setGame((game) => {
      const newGame = game.makeCopy();
      newGame.makeGuess(coordinate);
      return newGame;
    });
    setCanGuess(false);
  }

  function oppBoardClickCheck(coordinate: Coordinate): boolean {
    if (!canGuess) {
      return false;
    }
    return game.canGuess(coordinate);
  }

  function onPassClick() {
    setGame((game) => {
      const newGame = game.makeCopy();
      newGame.pass();
      return newGame;
    });
    setDisplaySwitch(true);
  }

  if (displaySwitch) {
    return (
      <MessageOverlay
        display
        message={playerBoard.player}
        description="It's your turn!"
        buttons={[
          <button
            onClick={() => {
              setCanGuess(true);
              setDisplaySwitch(false);
            }}
          >
            READY
          </button>,
        ]}
      />
    );
  } else {
    return (
      <>
        <PlayScreen
          playerBoard={playerBoard}
          opponentBoard={opponentBoard}
          onOppBoardClick={onOppBoardClick}
          oppBoardClickCheck={oppBoardClickCheck}
          playMenu={
            <PlayMenu
              guesses={game.guesses}
              player1={game.player1!.player}
              player2={game.player2!.player}
              info="It's your turn!"
              actions={[
                <button onClick={onPassClick} disabled={canGuess || over}>
                  PASS
                </button>,
              ]}
            />
          }
        />
        <MessageOverlay
          display={over}
          background
          message="You win!"
          description={`Congratulations, ${playerBoard.player}!`}
          buttons={[
            <button onClick={() => setDisplayResults(true)}>SEE RESULTS</button>,
            <button onClick={() => navigate("/")}>MAIN MENU</button>,
          ]}
        />
      </>
    );
  }
}
