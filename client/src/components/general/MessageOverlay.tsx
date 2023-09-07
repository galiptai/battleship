import "./MessageOverlay.css";
import { ReactNode } from "react";

type MessageOverlayProps = {
  display: boolean;
  background?: boolean;
  message: string;
  description?: string | ReactNode;
  buttons?: ReactNode[];
  zIndex?: number;
};

export function MessageOverlay({
  display,
  background,
  message,
  description,
  buttons,
  zIndex,
}: MessageOverlayProps) {
  buttons = buttons ?? [];
  zIndex = zIndex ?? 200;
  if (display) {
    return (
      <div className={`overlay ${background ? "overlay-background" : ""}`} style={{ zIndex }}>
        <div className="overlay-placeholder"></div>
        <div className="overlay-text">
          <div className="overlay-message">{message}</div>
          <div className="overlay-description">{description}</div>
        </div>
        <div className="overlay-buttons">{...buttons}</div>
      </div>
    );
  }
  return <></>;
}
