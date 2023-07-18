import { useState } from "react";
import { Board } from "./Board";
import { SwitchScreen } from "./SwitchScreen";
import { PlayScreen } from "./PlayScreen";

type localGameProps = {
  p1Board: Board;
  setP1Board: (board: Board) => void;
  p2Board: Board;
  setP2Board: (board: Board) => void;
};
export function LocalGame({ p1Board, setP1Board, p2Board, setP2Board }: localGameProps) {
  const [p1Turn, setP1Turn] = useState<boolean>(true);
  const [displaySwitch, setDisplaySwitch] = useState<boolean>(true);

  if (displaySwitch) {
    return <SwitchScreen player={p1Turn ? p1Board.player : p2Board.player} setDisplaySwitch={setDisplaySwitch} />;
  } else if (p1Turn) {
    return (
      <PlayScreen
        playerBoard={p1Board}
        setPlayerBoard={setP1Board}
        opponentBoard={p2Board}
        setOpponentBoard={setP2Board}
      />
    );
  } else {
    return (
      <PlayScreen
        playerBoard={p2Board}
        setPlayerBoard={setP2Board}
        opponentBoard={p1Board}
        setOpponentBoard={setP1Board}
      />
    );
  }
}
