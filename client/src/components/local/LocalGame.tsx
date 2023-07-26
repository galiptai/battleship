import { useState } from "react";
import { Coordinate } from "../gameplay/DrawBoard";
import { SwitchScreen } from "./SwitchScreen";
import { PlayScreen } from "../gameplay/PlayScreen";
import { PlayMenu } from "../gameplay/PlayMenu";
import { EndOverlay } from "../gameplay/EndOverlay";
import { Board } from "../../logic/Board";
import { Guess } from "../../logic/gameLogic";

type LocalGameProps = {
  p1Board: Board;
  setP1Board: (board: Board) => void;
  p2Board: Board;
  guesses: Guess[];
  setGuesses: (guesses: Guess[]) => void;
  setP2Board: (board: Board) => void;
  setGameOver: (gameOver: boolean) => void;
};

export function LocalGame({
  p1Board,
  setP1Board,
  p2Board,
  setP2Board,
  guesses,
  setGuesses,
  setGameOver,
}: LocalGameProps) {
  const [p1Turn, setP1Turn] = useState<boolean>(true);
  const [displaySwitch, setDisplaySwitch] = useState<boolean>(true);
  const [canGuess, setCanGuess] = useState<boolean>(false);

  function onOppBoardClick(coordinate: Coordinate) {
    if (!canGuess) {
      return;
    }
    const board = p1Turn ? p2Board : p1Board;
    const tile = board.tiles[coordinate.y][coordinate.x];
    if (!tile.hit) {
      const setBoard = p1Turn ? setP2Board : setP1Board;
      tile.hit = true;
      setBoard(board.makeCopy());
      const player = p1Turn ? p1Board.player : p2Board.player;
      guesses.push({
        coordinate: tile.coordinate,
        hit: tile.placedShip !== null,
        player,
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
    if (!tile.hit) {
      return true;
    }
    return false;
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
    let win = false;
    if (!canGuess && opponentBoard.checkAllBoatsSank()) {
      win = true;
    }

    return (
      <>
        <PlayScreen
          playerBoard={playerBoard}
          opponentBoard={opponentBoard}
          onOppBoardClick={onOppBoardClick}
          oppBoardClickCheck={oppBoardClickCheck}
        >
          <PlayMenu guesses={guesses} player1={p1Board.player} player2={p2Board.player}>
            <button onClick={onPassClick} disabled={canGuess || win}>
              PASS
            </button>
          </PlayMenu>
        </PlayScreen>
        <EndOverlay display={win} won={true} setGameOver={setGameOver} />
      </>
    );
  }
}
