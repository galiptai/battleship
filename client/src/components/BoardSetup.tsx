import { useState } from "react";
import { Board, DrawBoard } from "./Board";
import { ShipSelector } from "./ShipSelector";
import { Ship } from "../logic/Ship";
import { getShips } from "../logic/gameLogic";
import "./BoardSetup.css";

type boardSetupProps = {
  board: Board;
  setBoard: (board: Board) => void;
};

export function BoardSetup({ board, setBoard }: boardSetupProps) {
  const [shipsToPlace, setShipsToPlace] = useState<Ship[]>(getShips());
  return (
    <div className="boardSetup">
      <DrawBoard board={board} setBoard={setBoard} />
      <ShipSelector shipsToPlace={shipsToPlace} />
    </div>
  );
}
