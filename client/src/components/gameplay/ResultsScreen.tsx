import { useNavigate } from "react-router-dom";
import { DrawBoard } from "./DrawBoard";
import "./ResultsScreen.css";
import { Board } from "../../logic/Board";
import { Guess } from "../../logic/gameLogic";

type ResultsScreenProps = {
  winner: string;
  p1Board: Board;
  p2Board: Board;
  guesses: Guess[];
};

export function ResultsScreen({ winner, p1Board, p2Board, guesses }: ResultsScreenProps) {
  const navigate = useNavigate();
  return (
    <div className="results">
      <div className="results-won">{winner} won!</div>
      <div className="results-grid">
        <div className="results-stats-player">{p1Board.player}</div>
        <div className="results-stats-player">{p2Board.player}</div>
        <DrawBoard board={p2Board} showShips="all" />
        <DrawBoard board={p1Board} showShips="all" />
        <GuessStats guesses={guesses.filter((guess) => guess.player === p1Board.player)} />
        <GuessStats guesses={guesses.filter((guess) => guess.player === p2Board.player)} />
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
  const percent = ((hits / total) * 100).toFixed(2);
  return (
    <div className="results-stats">
      <div>Guesses: {total}</div>
      <div>Hits: {hits}</div>
      <div>Misses: {misses}</div>
      <div>Accuracy: {percent}%</div>
    </div>
  );
}
