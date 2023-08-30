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
import { Layout } from "./components/general/Layout.tsx";
import { Home } from "./components/general/Home.tsx";
import { ErrorBoundary } from "./components/general/ErrorBoundary.tsx";
import { JoinQuick } from "./components/online/join/JoinQuick.tsx";
import { JoinPrivate } from "./components/online/join/JoinPrivate.tsx";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route element={<Layout />} errorElement={<ErrorBoundary />}>
        <Route index element={<Home />} />,
        <Route path="/local" element={<LocalLoader />} />,
        <Route path="/online/quick" element={<Connection JoinComponent={JoinQuick} />} />,
        <Route path="/online/private" element={<Connection JoinComponent={JoinPrivate} />} />,
      </Route>,
      <Route path="*" element={<Navigate to="/" />} />,
    ])
  );

  return (
    <DndProvider options={HTML5toTouch}>
      <RouterProvider router={router} />
    </DndProvider>
  );
}
