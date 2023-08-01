import { useNavigate } from "react-router-dom";
import "./App.css";

export default function App() {
  const navigate = useNavigate();
  return (
    <div className="home">
      <div className="home-title">BATTLESHIP</div>
      <div className="home-menu">
        <div className="home-option" onClick={() => navigate("/local")}>
          Local game
        </div>
        <div className="home-option" onClick={() => navigate("/online")}>Online random</div>
        <div className="home-option not-implemented">Online custom</div>
      </div>
      <div className="home-footer">Made by Gabor Liptai</div>
    </div>
  );
}
