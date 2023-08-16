import { useState, useCallback } from "react";
import { Coordinate, DrawBoard, Highlight } from "../gameplay/DrawBoard";
import { Ship } from "../../logic/Ship";
import { createEmptyBoard, getShips } from "../../logic/gameLogic";
import "./BoardSetup.css";
import { SetupMenu } from "./SetupMenu";
import { Board } from "../../logic/Board";
import { ShipPlacement } from "./ShipSelector";

type BoardSetupProps = {
  starterName: string;
  setVerifiedBoard: (board: Board) => void | Promise<void>;
  disabled?: boolean;
  readyBtnText?: string;
};

export function BoardSetup({
  starterName,
  setVerifiedBoard,
  disabled,
  readyBtnText,
}: BoardSetupProps) {
  const [board, setBoard] = useState<Board>(createEmptyBoard(10, 10, starterName));
  const [shipsToPlace] = useState<Ship[]>(getShips());
  const [verified, setVerified] = useState<boolean>(false);
  const [highlight, setHighlight] = useState<Highlight>({ type: "none", tiles: [] });

  const highlighter = useCallback(
    (startCoordinate: Coordinate | null, placement: ShipPlacement | null) => {
      const highlight: Highlight = {
        type: "none",
        tiles: [],
      };
      if (startCoordinate === null || placement === null) {
        setHighlight(highlight);
        return;
      }
      highlight.tiles = board.getTiles(startCoordinate, placement);
      if (board.canAddShip(startCoordinate, placement)) {
        highlight.type = "valid";
      } else {
        highlight.type = "invalid";
      }
      setHighlight(highlight);
    },
    [board]
  );

  function onDrop(startCoordinate: Coordinate, placement: ShipPlacement) {
    board.addShip(startCoordinate, placement);
    setBoard(board.makeCopy());
    setVerified(board.isValid());
  }

  function dropCheck(startCoordinate: Coordinate, placement: ShipPlacement): boolean {
    return board.canAddShip(startCoordinate, placement);
  }

  function onBoardClick(coordinate: Coordinate) {
    if (disabled) {
      return;
    }
    const tile = board.tiles[coordinate.y][coordinate.x];
    if (tile.placedShip === null) {
      return;
    }
    const ship = tile.placedShip;
    ship.removeTiles();
    board.ships.delete(ship);
    setBoard(board.makeCopy());
    setVerified(board.isValid());
  }

  function clickCheck(coordinate: Coordinate): boolean {
    if (disabled) {
      return false;
    }
    const tile = board.tiles[coordinate.y][coordinate.x];
    return tile.placedShip !== null;
  }

  function onReadyClick() {
    if (board.isValid()) {
      void setVerifiedBoard(board);
    }
  }

  return (
    <div className="board-setup">
      <div className="board-setup-menu">
        <SetupMenu
          board={board}
          setBoard={setBoard}
          shipsToPlace={shipsToPlace}
          setVerified={setVerified}
          disabled={disabled}
        />
      </div>
      <div className="board-setup-board">
        <DrawBoard
          board={board}
          onClick={onBoardClick}
          clickCheck={clickCheck}
          highlighter={highlighter}
          showShips="all"
          onDrop={onDrop}
          dropCheck={dropCheck}
          highlight={highlight}
        />
      </div>
      <div className="board-setup-ready">
        <button disabled={!verified || disabled} onClick={onReadyClick}>
          {readyBtnText ? readyBtnText : "READY"}
        </button>
      </div>
    </div>
  );
}
