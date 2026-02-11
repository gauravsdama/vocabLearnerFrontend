import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./auth/RequireAuth";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tutorial from "./pages/Tutorial";
import Settings from "./pages/Settings";
import Stats from "./pages/Stats";
import FeedScreen from "./feed/FeedScreen";

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/feed"
          element={
            <RequireAuth>
              <FeedScreen />
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <Settings />
            </RequireAuth>
          }
        />
        <Route
          path="/tutorial"
          element={
            <RequireAuth>
              <Tutorial />
            </RequireAuth>
          }
        />
        <Route
          path="/stats"
          element={
            <RequireAuth>
              <Stats />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
