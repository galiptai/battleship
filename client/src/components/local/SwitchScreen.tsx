import "./SwitchScreen.css";

type SwitchScreenProps = {
  player: string;
  setDisplaySwitch: (on: boolean) => void;
  setCanGuess: (boolean: boolean) => void;
};
export function SwitchScreen({ player, setDisplaySwitch, setCanGuess }: SwitchScreenProps) {
  function onClick() {
    setCanGuess(true);
    setDisplaySwitch(false);
  }

  return (
    <div className="switch-screen">
      <div className="switch-screen-name">{player}</div>
      <div>It's your turn!</div>
      <div>
        <button onClick={onClick}>READY</button>
      </div>
    </div>
  );
}
