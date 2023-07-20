import { useState } from "react";
import { createEmptyBoard } from "../../logic/gameLogic";
import { Board } from "../gameplay/Board";
import { BoardSetup } from "../setup/BoardSetup";
import { LocalGame } from "./LocalGame";

export function Local() {
  const [p1Board, setP1Board] = useState<Board | null>(null);
  const [p2Board, setP2Board] = useState<Board | null>(null);

  // return (
  //   <LocalGame
  //     p1Board={createEmptyBoard()}
  //     setP1Board={setP1Board}
  //     p2Board={createEmptyBoard()}
  //     setP2Board={setP2Board}
  //   />
  // );

  if (p1Board === null) {
    return <BoardSetup key="P1" starterName={"Player 1"} setVerifiedBoard={setP1Board} />;
  } else if (p2Board === null) {
    return <BoardSetup key="P2" starterName={"Player 2"} setVerifiedBoard={setP2Board} />;
  } else {
    return (
      <LocalGame
        p1Board={p1Board}
        setP1Board={setP1Board}
        p2Board={p2Board}
        setP2Board={setP2Board}
      />
    );
  }
}
