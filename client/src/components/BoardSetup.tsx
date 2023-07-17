import { useState } from "react";
import { Board, Coordinate, DrawBoard, Highlight } from "./Board";
import { ShipSelector } from "./ShipSelector";
import { Ship } from "../logic/Ship";
import { getShips } from "../logic/gameLogic";
import "./BoardSetup.css";

type boardSetupProps = {
  board: Board;
  setBoard: (board: Board) => void;
};

export function BoardSetup({ board, setBoard }: boardSetupProps) {
  const [shipsToPlace] = useState<Ship[]>(getShips());
  const [selectedShipIndex, setSelectedShipIndex] = useState<number>(-1);
  const [horizontal, setHorizontal] = useState<boolean>(false);

  function onClick(selection: Highlight) {
    if (selection.type === "invalid" || selection.tiles.length === 0) {
      return;
    }
    const ship = shipsToPlace[selectedShipIndex];
    ship.setTiles([...selection.tiles]);
    const newBoard = { ...board };
    newBoard.ships.push(ship);
    setBoard({ ...board });
    setSelectedShipIndex(-1);
  }

  function highlightAssigner(baseCoordinate: Coordinate | null): Highlight {
    const highlight: Highlight = {
      type: "neutral",
      tiles: [],
    };
    if (selectedShipIndex === -1 || baseCoordinate === null) {
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
      highlight.tiles.some((tile) => tile.placedShip !== null)
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
          onClick={onClick}
          highlightAssigner={highlightAssigner}
        />
      </div>
      <ShipSelector
        shipsToPlace={shipsToPlace}
        selectedIndex={selectedShipIndex}
        setSelectedIndex={setSelectedShipIndex}
        horizontal={horizontal}
        setHorizontal={setHorizontal}
      />
    </div>
  );
}
