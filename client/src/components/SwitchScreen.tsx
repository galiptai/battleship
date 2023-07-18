import "./SwitchScreen.css";

type switchScreenProps = {
  player: string;
  setDisplaySwitch: (on: boolean) => void;
};
export function SwitchScreen({ player, setDisplaySwitch }: switchScreenProps) {
  return (
    <div className="switch-screen">
      <div className="switch-screen-name">{player}</div>
      <div>It's your turn!</div>
      <div>
        <button onClick={() => setDisplaySwitch(false)}>READY</button>
      </div>
    </div>
  );
}
