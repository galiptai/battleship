import "./EndOverlay.css";

type endOverLayProps = {
  display: boolean;
  won: boolean;
};

export function EndOverlay({ display, won }: endOverLayProps) {
  if (display) {
    return (
      <div className="end-overlay">
        <div className="end-overlay-text">You {won ? "Win" : "Lose"}!</div>
      </div>
    );
  }
  return <></>;
}
