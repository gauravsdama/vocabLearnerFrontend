import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { MessageProvider } from "./components/MessageCenter";
import { runContractTest } from "./utils/contractTest";
import "./styles.css";

const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ||
  import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID?.trim() ||
  "";

if (import.meta.env.DEV) {
  runContractTest();
}

const appTree = (
  <BrowserRouter>
    <AuthProvider>
      <MessageProvider>
        <App />
        <Analytics />
      </MessageProvider>
    </AuthProvider>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>{appTree}</GoogleOAuthProvider>
    ) : (
      appTree
    )}
  </React.StrictMode>,
);
