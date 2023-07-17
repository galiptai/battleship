import { useState } from "react";
import { Board, Coordinate, DrawBoard, Highlight } from "./Board";
import { Ship } from "../logic/Ship";
import { checkNeighborsEmpty, createEmptyBoard, getShips, verifyBoard } from "../logic/gameLogic";
import "./BoardSetup.css";
import { SetupMenu } from "./SetupMenu";

type boardSetupProps = {
  starterName: string;
  setVerifiedBoard: (board: Board) => void;
};

export function BoardSetup({ starterName, setVerifiedBoard }: boardSetupProps) {
  const [board, setBoard] = useState<Board>(createEmptyBoard(10, 10, starterName));
  const [shipsToPlace] = useState<Ship[]>(getShips());
  const [selectedShipIndex, setSelectedShipIndex] = useState<number>(-1);
  const [horizontal, setHorizontal] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);

  function onReadyClick() {
    if (verifyBoard(board)) {
      setVerifiedBoard(board);
    }
  }

  function onBoardClick(selection: Highlight) {
    if (selectedShipIndex !== -1 && selection.type == "valid") {
      const ship = shipsToPlace[selectedShipIndex];
      ship.setTiles([...selection.tiles]);
      const newBoard = { ...board };
      newBoard.ships.push(ship);
      setBoard(newBoard);
      setSelectedShipIndex(-1);
      setVerified(verifyBoard(newBoard));
    } else if (
      selectedShipIndex === -1 &&
      selection.tiles.some((tile) => tile.placedShip !== null)
    ) {
      const shipIndex = board.ships.findIndex((ship) => ship.tiles.includes(selection.tiles[0]));
      if (shipIndex === -1) {
        return;
      }
      const ship = board.ships[shipIndex];
      ship.removeTiles();
      const newBoard = { ...board };
      newBoard.ships.splice(shipIndex, 1);
      setBoard(newBoard);
      setVerified(verifyBoard(newBoard));
    }
  }

  function highlightAssigner(baseCoordinate: Coordinate | null): Highlight {
    const highlight: Highlight = {
      type: "neutral",
      tiles: [],
    };

    if (baseCoordinate === null) {
      return highlight;
    }

    if (selectedShipIndex === -1) {
      highlight.tiles.push(board.tiles[baseCoordinate.y][baseCoordinate.x]);
      return highlight;
    }

    const ship = shipsToPlace[selectedShipIndex];
    const yLimit = Math.min(
      board.height - 1,
      baseCoordinate.y + (horizontal ? 0 : ship.length - 1)
    );
    for (let y = baseCoordinate.y; y <= yLimit; y++) {
      const xLimit = Math.min(
        board.width - 1,
        baseCoordinate.x + (horizontal ? ship.length - 1 : 0)
      );
      for (let x = baseCoordinate.x; x <= xLimit; x++) {
        highlight.tiles.push(board.tiles[y][x]);
      }
    }
    if (
      highlight.tiles.length < ship.length ||
      highlight.tiles.some((tile) => tile.placedShip !== null) ||
      !checkNeighborsEmpty(board, highlight.tiles)
    ) {
      highlight.type = "invalid";
    } else {
      highlight.type = "valid";
    }

    return highlight;
  }

  return (
    <div className="board-setup">
      <div className="board-setup-board">
        <DrawBoard
          board={board}
          setBoard={setBoard}
          onClick={onBoardClick}
          highlightAssigner={highlightAssigner}
        />
      </div>
      <SetupMenu
        board={board}
        setBoard={setBoard}
        shipsToPlace={shipsToPlace}
        selectedIndex={selectedShipIndex}
        setSelectedIndex={setSelectedShipIndex}
        horizontal={horizontal}
        setHorizontal={setHorizontal}
        verified={verified}
        setVerified={setVerified}
        onReadyClick={onReadyClick}
      />
    </div>
  );
}
