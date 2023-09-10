import { ReactNode } from "react";
import "./Menu.css";

type MenuProps = {
  title: string;
  options: ReactNode[];
};

export function Menu({ title, options }: MenuProps) {
  return (
    <div className="menu">
      <div className="menu-title">{title}</div>
      <div className="menu-options">{...options}</div>
    </div>
  );
}
