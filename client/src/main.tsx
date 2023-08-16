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
import { DndProvider } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { LocalLoader } from "./components/local/LocalLoader.tsx";
import { Connection } from "./components/online/Connection.tsx";

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<App />} />,
    <Route path="/local" element={<LocalLoader />} />,
    <Route path="/online" element={<Connection />} />,
    <Route path="*" element={<Navigate to="/" />} />,
  ])
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DndProvider options={HTML5toTouch}>
      <RouterProvider router={router} />
    </DndProvider>
  </React.StrictMode>
);
