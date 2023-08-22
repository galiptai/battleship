import "./MessageOverlay.css";
import { ReactNode } from "react";

type MessageOverlayProps = {
  display: boolean;
  message: string;
  description?: string;
  buttons?: ReactNode[];
};

export function MessageOverlay({ display, message, description, buttons }: MessageOverlayProps) {
  if (!buttons) {
    buttons = [];
  }
  if (display) {
    return (
      <div className="overlay">
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
