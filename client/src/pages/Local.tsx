import { useState } from "react";
import { Board } from "../components/Board";
import { createEmptyBoard } from "../logic/gameLogic";
import { BoardSetup } from "../components/BoardSetup";

export default function Local() {
  const [p1Board, setP1Board] = useState<Board>(createEmptyBoard());
  console.log(p1Board);
  return <BoardSetup board={p1Board} setBoard={setP1Board} />;
}
