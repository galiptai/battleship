import { useNavigate } from "react-router-dom";
import "./EndOverlay.css";

type EndOverLayProps = {
  display: boolean;
  playerIsWinner: boolean;
  setDisplayResults: (displayResults: boolean) => void;
};

export function EndOverlay({ display, playerIsWinner, setDisplayResults }: EndOverLayProps) {
  const navigate = useNavigate();
  if (display) {
    return (
      <div className="end-overlay">
        <div className="end-overlay-placeholder"></div>
        <div className="end-overlay-text">You {playerIsWinner ? "Win" : "Lose"}!</div>
        <div className="end-overlay-buttons">
          <button onClick={() => setDisplayResults(true)}>SEE RESULTS</button>
          <button onClick={() => navigate("/")}>MAIN MENU</button>
        </div>
      </div>
    );
  }
  return <></>;
}
