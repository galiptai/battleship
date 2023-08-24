import { useNavigate } from "react-router-dom";
import { DrawBoard } from "../gameplay/DrawBoard";
import "./ResultsScreen.css";
import { Board } from "../../logic/Board";
import { Guess } from "../../logic/gameLogic";
import { WhichPlayer } from "../../logic/OnlineGame";

type ResultsScreenProps = {
  winner: string;
  p1Board: Board;
  p2Board: Board;
  guesses: Guess[];
  playerIs: WhichPlayer;
};

export function ResultsScreen({ winner, p1Board, p2Board, guesses, playerIs }: ResultsScreenProps) {
  const navigate = useNavigate();
  return (
    <div className="results">
      <div className="results-won">{winner} won!</div>
      <div className="results-grid-container">
        <div className="results-grid">
          <div className="results-stats-player">
            <div>{p1Board.player}</div>
          </div>
          <div className="results-stats-player">
            <div>{p2Board.player}</div>
          </div>
          <DrawBoard board={p2Board} showShips="all" />
          <DrawBoard board={p1Board} showShips="all" />
          <GuessStats guesses={guesses.filter((guess) => guess.player === playerIs)} />
          <GuessStats guesses={guesses.filter((guess) => guess.player !== playerIs)} />
        </div>
      </div>
      <button className="results-button" onClick={() => navigate("/")}>
        MAIN MENU
      </button>
    </div>
  );
}

type GuessStatsProps = {
  guesses: Guess[];
};
function GuessStats({ guesses }: GuessStatsProps) {
  const total = guesses.length;
  const hits = guesses.filter((guess) => guess.hit).length;
  const misses = total - hits;
  const percent = total === 0 || hits === 0 ? 0 : ((hits / total) * 100).toFixed(2);
  return (
    <div className="results-stats">
      <div>Guesses: {total}</div>
      <div>Hits: {hits}</div>
      <div>Misses: {misses}</div>
      <div>Accuracy: {percent}%</div>
    </div>
  );
}
