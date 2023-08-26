import { useEffect, useState } from "react";
import { Coordinate } from "../gameplay/DrawBoard";
import { SwitchScreen } from "./SwitchScreen";
import { PlayScreen } from "../gameplay/PlayScreen";
import { PlayMenu } from "../gameplay/PlayMenu";
import { MessageOverlay } from "../general/MessageOverlay";
import { Board } from "../../logic/Board";
import { Guess } from "../../logic/gameLogic";
import { useNavigate } from "react-router-dom";

type LocalPlayProps = {
  p1Board: Board;
  setP1Board: (board: Board) => void;
  p2Board: Board;
  setP2Board: (board: Board) => void;
  guesses: Guess[];
  setGuesses: (guesses: Guess[]) => void;
  p1Starts: boolean;
  setDisplayResults: (displayResults: boolean) => void;
  winner: string | null;
  setWinner: (winner: string | null) => void;
};

export function LocalPlay({
  p1Board,
  setP1Board,
  p2Board,
  setP2Board,
  guesses,
  setGuesses,
  p1Starts,
  setDisplayResults,
  winner,
  setWinner,
}: LocalPlayProps) {
  const navigate = useNavigate();
  const [p1Turn, setP1Turn] = useState<boolean>(p1Starts);
  const [displaySwitch, setDisplaySwitch] = useState<boolean>(true);
  const [canGuess, setCanGuess] = useState<boolean>(false);

  useEffect(() => {
    const playerBoard = p1Turn ? p1Board : p2Board;
    const opponentBoard = p1Turn ? p2Board : p1Board;
    if (!canGuess && opponentBoard.checkAllBoatsSank()) {
      setWinner(playerBoard.player);
    }
  }, [p1Turn, p1Board, p2Board, canGuess, setWinner]);

  function onOppBoardClick(coordinate: Coordinate) {
    if (!canGuess) {
      return;
    }
    const board = p1Turn ? p2Board : p1Board;
    const tile = board.tiles[coordinate.y][coordinate.x];
    if (!tile.guessed) {
      const setBoard = p1Turn ? setP2Board : setP1Board;
      tile.guessed = true;
      setBoard(board.makeCopy());
      guesses.push({
        coordinate: tile.coordinate,
        hit: tile.placedShip !== null,
        player: p1Turn ? "PLAYER1" : "PLAYER2",
      });
      setGuesses([...guesses]);
      setCanGuess(false);
    }
  }

  function oppBoardClickCheck(coordinate: Coordinate): boolean {
    if (!canGuess) {
      return false;
    }
    const board = p1Turn ? p2Board : p1Board;
    const tile = board.tiles[coordinate.y][coordinate.x];
    return !tile.guessed;
  }

  function onPassClick() {
    setDisplaySwitch(true);
    setP1Turn(!p1Turn);
  }

  if (displaySwitch) {
    return (
      <SwitchScreen
        player={p1Turn ? p1Board.player : p2Board.player}
        setDisplaySwitch={setDisplaySwitch}
        setCanGuess={setCanGuess}
      />
    );
  } else {
    const playerBoard = p1Turn ? p1Board : p2Board;
    const opponentBoard = p1Turn ? p2Board : p1Board;
    const over = winner !== null;

    return (
      <>
        <PlayScreen
          playerBoard={playerBoard}
          opponentBoard={opponentBoard}
          onOppBoardClick={onOppBoardClick}
          oppBoardClickCheck={oppBoardClickCheck}
          playMenu={
            <PlayMenu
              guesses={guesses}
              player1={p1Board.player}
              player2={p2Board.player}
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
