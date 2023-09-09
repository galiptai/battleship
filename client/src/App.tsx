import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { DndProvider } from "react-dnd-multi-backend";
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { ErrorBoundary } from "./components/general/ErrorBoundary.tsx";
import { Home } from "./components/general/Home.tsx";
import { Layout } from "./components/general/Layout.tsx";
import { SaveProvider } from "./components/local/SaveProvider.tsx";
import { ConnectionProvider } from "./components/online/ConnectionProvider.tsx";
import { Online } from "./components/online/Online.tsx";
import { LocalGameFlow } from "./components/local/LocalGameFlow.tsx";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route element={<Layout />} errorElement={<ErrorBoundary />}>
        <Route index element={<Home />} />,
        <Route
          path="/local"
          element={
            <SaveProvider>
              <LocalGameFlow />
            </SaveProvider>
          }
        />
        ,
        <Route
          path="/online/public"
          element={
            <ConnectionProvider>
              <Online joinMode="PUBLIC" />
            </ConnectionProvider>
          }
        />
        ,
        <Route
          path="/online/private"
          element={
            <ConnectionProvider>
              <Online joinMode="PRIVATE" />
            </ConnectionProvider>
          }
        />
        ,
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
