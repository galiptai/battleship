import { useRef, useState, ReactNode } from "react";
import "./PlayMenu.css";
import { GuessList } from "./GuessList";
import { Guess } from "../../logic/Game";
export type PlayMenuTabs = "Actions" | "Guesses" | "Chat";

type PlayMenuProps = {
  player1: string;
  player2: string;
  info: string;
  guesses: Guess[];
  actions?: ReactNode[];
};

export function PlayMenu({ guesses, player1, player2, info, actions }: PlayMenuProps) {
  const [currentTab, setCurrentTab] = useState<PlayMenuTabs>(() =>
    actions ? "Actions" : "Guesses"
  );
  const content = useRef<HTMLDivElement>(null);
  actions = actions ?? [];

  const tabs: PlayMenuTabs[] = ["Guesses"];
  if (actions.length > 0) {
    tabs.unshift("Actions");
  }

  function displayTab(): JSX.Element | undefined {
    switch (currentTab) {
      case "Actions":
        return <div className="play-menu-actions">{...actions!}</div>;
      case "Guesses":
        return (
          <GuessList
            container={content.current}
            guesses={guesses}
            player1={player1}
            player2={player2}
          />
        );
      case "Chat":
        return <div>Not implemented</div>;
    }
  }
  return (
    <div className="play-menu">
      <div className="play-menu-info">{info}</div>
      <div className="play-menu-box">
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
    </div>
  );
}
