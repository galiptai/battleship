import { useNavigate, useRouteError } from "react-router-dom";
import { MessageOverlay } from "./MessageOverlay";

export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  let message;
  if (typeof error === "string") {
    message = error;
  } else if ((error as Error).message) {
    message = (error as Error).message;
  }
  return (
    <MessageOverlay
      display
      message="Something went wrong."
      description={message ? `Error: ${message}` : message}
      buttons={[<button onClick={() => navigate("/")}>MAIN MENU</button>]}
    />
  );
}
