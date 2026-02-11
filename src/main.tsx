import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { MessageProvider } from "./components/MessageCenter";
import { runContractTest } from "./utils/contractTest";
import "./styles.css";

if (import.meta.env.DEV) {
  runContractTest();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MessageProvider>
          <App />
        </MessageProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
