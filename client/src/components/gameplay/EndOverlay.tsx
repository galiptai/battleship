import { useNavigate } from "react-router-dom";
import "./EndOverlay.css";

type EndOverLayProps = {
  display: boolean;
  won: boolean;
  setGameOver: (boolean: boolean) => void;
};

export function EndOverlay({ display, won, setGameOver }: EndOverLayProps) {
  const navigate = useNavigate();
  if (display) {
    return (
      <div className="end-overlay">
        <div className="end-overlay-placeholder"></div>
        <div className="end-overlay-text">You {won ? "Win" : "Lose"}!</div>
        <div className="end-overlay-buttons">
          <button onClick={() => setGameOver(true)}>SEE RESULTS</button>
          <button onClick={() => navigate("/")}>MAIN MENU</button>
        </div>
      </div>
    );
  }
  return <></>;
}
