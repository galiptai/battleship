import { useState } from "react";
import { Guess } from "./Board";
import "./PlayMenu.css";

export type PlayMenuTabs = "Actions" | "Guesses" | "Chat";

type playMenuProps = {
  children?: JSX.Element | JSX.Element[];
} & guessListProps;
export function PlayMenu({ guesses, player1, player2, children }: playMenuProps) {
  const [currentTab, setCurrentTab] = useState<PlayMenuTabs>("Guesses");

  const tabs: PlayMenuTabs[] = ["Guesses"];
  if (children) {
    tabs.unshift("Actions");
  }

  function displayTab(): JSX.Element | undefined {
    switch (currentTab) {
      case "Actions":
        return <div>{children}</div>;
      case "Guesses":
        return GuessList({ guesses, player1, player2 });
      case "Chat":
        return <div>Not implemented</div>;
    }
  }
  return (
    <div className="play-menu">
      <div
        className="play-menu-tabs"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
      >
        {tabs.map((tab) => (
          <button onClick={() => setCurrentTab(tab)}>{tab}</button>
        ))}
      </div>
      {displayTab()}
    </div>
  );
}
type guessListProps = {
  player1: string;
  player2: string;
  guesses: Guess[];
};
function GuessList({ guesses, player1, player2 }: guessListProps) {
  return (
    <div className="guess-list-container">
      <div className="guess-list">
        <div>{player1}</div>
        <div>{player2}</div>
        {guesses.map((guess) => (
          <div>
            {guess.coordinate.x}:{guess.coordinate.y}
          </div>
        ))}
      </div>
    </div>
  );
}
