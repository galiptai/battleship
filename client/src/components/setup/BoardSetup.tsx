import { useState, useCallback } from "react";
import { Coordinate, DrawBoard, Highlight } from "../gameplay/DrawBoard";
import { Ship, ShipTypeKey, createShips } from "../../logic/Ship";
import "./BoardSetup.css";
import { SetupMenu } from "./SetupMenu";
import { Board } from "../../logic/Board";
import { RuleData } from "../../logic/Rules";
import { ShipPlacement } from "./shipSelector/ShipDrag";

type BoardSetupProps = {
  rules: RuleData;
  starterName: string;
  setVerifiedBoard: (board: Board) => void | Promise<void>;
  disabled?: boolean;
  readyBtnText?: string;
};

export function BoardSetup({
  rules,
  starterName,
  setVerifiedBoard,
  disabled,
  readyBtnText,
}: BoardSetupProps) {
  const [board, setBoard] = useState<Board>(Board.createEmptyBoard(rules.dimensions, starterName));
  const [shipsToPlace] = useState<Map<ShipTypeKey, Ship[]>>(createShips(rules.ships));
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
      const { ship, vertical } = placement;
      highlight.tiles = board.getTiles(ship.type.length, startCoordinate, vertical);
      if (board.canAddShip(ship, startCoordinate, vertical)) {
        highlight.type = "valid";
      } else {
        highlight.type = "invalid";
      }
      setHighlight(highlight);
    },
    [board]
  );

  function onDrop(startCoordinate: Coordinate, placement: ShipPlacement) {
    board.addShip(placement.ship, startCoordinate, placement.vertical);
    setBoard(board.makeCopy());
    setVerified(board.isValid(rules));
  }

  function dropCheck(startCoordinate: Coordinate, placement: ShipPlacement): boolean {
    return board.canAddShip(placement.ship, startCoordinate, placement.vertical);
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
    setVerified(board.isValid(rules));
  }

  function clickCheck(coordinate: Coordinate): boolean {
    if (disabled) {
      return false;
    }
    const tile = board.tiles[coordinate.y][coordinate.x];
    return tile.placedShip !== null;
  }

  function onReadyClick() {
    if (board.isValid(rules)) {
      void setVerifiedBoard(board);
    }
  }

  function onNameInput(value: string) {
    board.player = value;
    setBoard(board.makeCopy());
    setVerified(board.isValid(rules));
  }

  return (
    <div className="board-setup">
      <div className="board-setup-menu">
        <SetupMenu
          board={board}
          onNameInput={onNameInput}
          shipsToPlace={shipsToPlace}
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
