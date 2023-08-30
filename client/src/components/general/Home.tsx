import "./Home.css";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();
  return (
    <div className="home">
      <div className="home-title">BATTLESHIP</div>
      <div className="home-menu">
        <div className="home-option" onClick={() => navigate("/local")}>
          Local game
        </div>
        <div className="home-option" onClick={() => navigate("/online/quick")}>
          Online quick game
        </div>
        <div className="home-option" onClick={() => navigate("/online/private")}>
          Online private game
        </div>
      </div>
      <div className="home-footer">Made by Gabor Liptai</div>
    </div>
  );
}
