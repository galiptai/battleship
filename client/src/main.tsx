import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Local } from "./components/local/Local.tsx";
import { DndProvider, usePreview } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { ShipPlacement } from "./components/setup/ShipSelector.tsx";

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<App />} />,
    <Route path="/local" element={<Local />} />,
    <Route path="*" element={<Navigate to="/" />} />,
  ])
);

// const HookPreview = ({ text }: { text: string }): JSX.Element | null => {
//   const preview = usePreview<ShipPlacement>();
//   if (!preview.display) {
//     return null;
//   }
//   const { style, item } = preview;
//   return <div style={{ ...style, background: "white" }}>{item.ship.type}</div>;
// };

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DndProvider options={HTML5toTouch}>
      {/* <HookPreview text="" /> */}
      <RouterProvider router={router} />
    </DndProvider>
  </React.StrictMode>
);
