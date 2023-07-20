import { useRef, useState } from "react";
import "./PlayMenu.css";
import { GuessList, guessListProps } from "./GuessList";
export type PlayMenuTabs = "Actions" | "Guesses" | "Chat";

type playMenuProps = {
  children?: JSX.Element | JSX.Element[];
} & guessListProps;

export function PlayMenu({ guesses, player1, player2, children }: playMenuProps) {
  const [currentTab, setCurrentTab] = useState<PlayMenuTabs>("Guesses");
  const content = useRef<HTMLDivElement>(null);

  const tabs: PlayMenuTabs[] = ["Guesses"];
  if (children) {
    tabs.unshift("Actions");
  }

  function displayTab(): JSX.Element | undefined {
    switch (currentTab) {
      case "Actions":
        return <div className="play-menu-actions">{children}</div>;
      case "Guesses":
        return (
          <GuessList box={content.current} guesses={guesses} player1={player1} player2={player2} />
        );
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
          <button key={tab} onClick={() => setCurrentTab(tab)} disabled={currentTab === tab}>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="tab-content" ref={content}>
        {displayTab()}
      </div>
    </div>
  );
}
