import { useState } from "react";
import { Board, Coordinate, Guess, Highlight } from "../gameplay/Board";
import { SwitchScreen } from "./SwitchScreen";
import { PlayScreen } from "../gameplay/PlayScreen";
import { PlayMenu } from "../gameplay/PlayMenu";

type localGameProps = {
  p1Board: Board;
  setP1Board: (board: Board) => void;
  p2Board: Board;
  setP2Board: (board: Board) => void;
};
export function LocalGame({ p1Board, setP1Board, p2Board, setP2Board }: localGameProps) {
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [p1Turn, setP1Turn] = useState<boolean>(true);
  const [displaySwitch, setDisplaySwitch] = useState<boolean>(true);
  const [canGuess, setCanGuess] = useState<boolean>(false);

  function onOppBoardClick(selection: Highlight) {
    if (selection.type !== "neutral" || selection.tiles.length === 0) {
      return;
    }
    const board = p1Turn ? p2Board : p1Board;
    const tile = selection.tiles[0];
    const setBoard = p1Turn ? setP2Board : setP1Board;
    tile.hit = true;
    setBoard({ ...board });
    const player = p1Turn ? p1Board.player : p2Board.player;
    guesses.push({
      coordinate: tile.coordinate,
      hit: tile.placedShip !== null,
      player,
    });
    setGuesses([...guesses]);
    setCanGuess(false);
  }

  function oppBoardHighlightAssigner(hoverCoordinate: Coordinate | null): Highlight {
    const highlight: Highlight = {
      type: "none",
      tiles: [],
    };
    if (hoverCoordinate === null || !canGuess) {
      return highlight;
    }
    const board = p1Turn ? p2Board : p1Board;
    const tile = board.tiles[hoverCoordinate.y][hoverCoordinate.x];
    if (!tile.hit) {
      highlight.type = "neutral";
      highlight.tiles.push(tile);
    }

    return highlight;
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
  } else if (p1Turn) {
    return (
      <PlayScreen
        playerBoard={p1Board}
        opponentBoard={p2Board}
        onOppBoardClick={onOppBoardClick}
        oppBoardHighlightAssigner={oppBoardHighlightAssigner}
      >
        <PlayMenu guesses={guesses} player1={p1Board.player} player2={p2Board.player}>
          <button onClick={onPassClick} disabled={canGuess}>
            PASS
          </button>
        </PlayMenu>
      </PlayScreen>
    );
  } else {
    return (
      <PlayScreen
        playerBoard={p2Board}
        opponentBoard={p1Board}
        onOppBoardClick={onOppBoardClick}
        oppBoardHighlightAssigner={oppBoardHighlightAssigner}
      >
        <PlayMenu guesses={guesses} player1={p1Board.player} player2={p2Board.player}>
          <button onClick={onPassClick} disabled={canGuess}>
            PASS
          </button>
        </PlayMenu>
      </PlayScreen>
    );
  }
}
