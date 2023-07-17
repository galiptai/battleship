import { useState } from "react";
import { Board } from "../components/Board";
import { BoardSetup } from "../components/BoardSetup";

export default function Local() {
  const [p1Board, setP1Board] = useState<Board | null>(null);
  const [p2Board, setP2Board] = useState<Board | null>(null);

  if (p1Board === null) {
    return <BoardSetup key="P1" setVerifiedBoard={setP1Board} />;
  } else if (p2Board === null) {
    return <BoardSetup key="P2" setVerifiedBoard={setP2Board} />;
  } else {
    return <div>GAME</div>;
  }
}
