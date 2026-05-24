import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import GuestOnly from "./auth/GuestOnly";
import RequireAuth from "./auth/RequireAuth";
import RequireVerifiedAuth from "./auth/RequireVerifiedAuth";
import ErrorBoundary from "./components/ErrorBoundary";
import RouteLoading from "./components/RouteLoading";

const Home = lazy(() => import("./pages/Home"));
const Intro = lazy(() => import("./pages/Intro"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const CheckEmail = lazy(() => import("./pages/CheckEmail"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const EmailVerified = lazy(() => import("./pages/EmailVerified"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Tutorial = lazy(() => import("./pages/Tutorial"));
const Settings = lazy(() => import("./pages/Settings"));
const SmsConsent = lazy(() => import("./pages/SmsConsent"));
const Stats = lazy(() => import("./pages/Stats"));
const FeedScreen = lazy(() => import("./feed/FeedScreen"));

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route
            path="/login"
            element={
              <GuestOnly>
                <Login />
              </GuestOnly>
            }
          />
          <Route
            path="/register"
            element={
              <GuestOnly>
                <Register />
              </GuestOnly>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <GuestOnly>
                <ForgotPassword />
              </GuestOnly>
            }
          />
          <Route
            path="/reset-password"
            element={
              <GuestOnly>
                <ResetPassword />
              </GuestOnly>
            }
          />
          <Route
            path="/check-email"
            element={
              <RequireAuth>
                <CheckEmail />
              </RequireAuth>
            }
          />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/email-verified" element={<EmailVerified />} />
          <Route
            path="/"
            element={<Intro />}
          />
          <Route
            path="/dashboard"
            element={
              <RequireVerifiedAuth>
                <Home />
              </RequireVerifiedAuth>
            }
          />
          <Route
            path="/feed"
            element={
              <RequireVerifiedAuth>
                <FeedScreen />
              </RequireVerifiedAuth>
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
            path="/settings/sms"
            element={
              <RequireAuth>
                <SmsConsent />
              </RequireAuth>
            }
          />
          <Route
            path="/tutorial"
            element={
              <RequireVerifiedAuth>
                <Tutorial />
              </RequireVerifiedAuth>
            }
          />
          <Route
            path="/stats"
            element={
              <RequireVerifiedAuth>
                <Stats />
              </RequireVerifiedAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
