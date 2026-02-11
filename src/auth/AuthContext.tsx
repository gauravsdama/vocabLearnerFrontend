import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiGet, apiPost, setUnauthorizedHandler } from "../api/client";
import type { AuthRequest, AuthResponse, TutorialStatusResponse } from "../api/types";
import { logError, logInfo } from "../utils/logger";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "../utils/storage";
import { clearLastAuthDiagnostic, setLastAuthDiagnostic } from "../utils/diagnostics";

type AuthContextValue = {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  markTutorialComplete: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState<string | null>(() => getAccessToken());
  const [tutorialCompleted, setTutorialCompleted] = useState<boolean | null>(null);
  const tutorialCheckInFlight = useRef(false);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearAccessToken();
      setToken(null);
      navigate("/login", { replace: true });
    });
  }, [navigate]);

  const fetchTutorialStatus = useCallback(async () => {
    if (tutorialCheckInFlight.current) {
      return null;
    }
    tutorialCheckInFlight.current = true;
    logInfo("WEB_TUTORIAL_STATUS_START", "Tutorial status check started", {
      method: "GET",
      url: "/tutorial/status",
    });
    try {
      const response = await apiGet<TutorialStatusResponse>("/tutorial/status");
      setTutorialCompleted(response.tutorial_completed);
      logInfo("WEB_TUTORIAL_STATUS_OK", "Tutorial status check succeeded", {
        method: "GET",
        url: "/tutorial/status",
        status: 200,
        tutorial_completed: response.tutorial_completed,
      });
      return response.tutorial_completed;
    } catch (error) {
      logError("WEB_TUTORIAL_STATUS_FAIL", "Tutorial status check failed", {
        method: "GET",
        url: "/tutorial/status",
        status: (error as { status?: number }).status ?? null,
        server_request_id: (error as { requestId?: string }).requestId ?? null,
        client_request_id:
          (error as { clientRequestId?: string }).clientRequestId ?? null,
      });
      return null;
    } finally {
      tutorialCheckInFlight.current = false;
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setTutorialCompleted(null);
      return;
    }
    if (tutorialCompleted === false) {
      if (location.pathname !== "/tutorial") {
        navigate("/tutorial", { replace: true });
      }
      return;
    }
    if (tutorialCompleted === null) {
      const path = location.pathname;
      fetchTutorialStatus().then((completed) => {
        if (completed === false && path !== "/tutorial") {
          navigate("/tutorial", { replace: true });
        }
        if (completed === true && path === "/tutorial") {
          navigate("/", { replace: true });
        }
      });
    }
  }, [token, tutorialCompleted, location.pathname, fetchTutorialStatus, navigate]);

  const login = useCallback(async (email: string, password: string) => {
    clearLastAuthDiagnostic();
    logInfo("WEB_AUTH_LOGIN_START", "Login started", {
      method: "POST",
      url: "/auth/login",
    });
    const payload: AuthRequest = { email, password };
    try {
      const response = await apiPost<AuthResponse>("/auth/login", payload);
      setAccessToken(response.access_token);
      setToken(response.access_token);
      logInfo("WEB_AUTH_LOGIN_OK", "Login succeeded", {
        method: "POST",
        url: "/auth/login",
      });
      const completed = await fetchTutorialStatus();
      if (completed === false) {
        navigate("/tutorial", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      setLastAuthDiagnostic("/auth/login", "POST", error);
      logError("WEB_AUTH_LOGIN_FAIL", "Login failed", {
        method: "POST",
        url: "/auth/login",
        status: (error as { status?: number }).status ?? null,
        server_request_id: (error as { requestId?: string }).requestId ?? null,
        client_request_id:
          (error as { clientRequestId?: string }).clientRequestId ?? null,
      });
      throw error;
    }
  }, [navigate]);

  const register = useCallback(async (email: string, password: string) => {
    clearLastAuthDiagnostic();
    logInfo("WEB_AUTH_REG_START", "Registration started", {
      method: "POST",
      url: "/auth/register",
    });
    const payload: AuthRequest = { email, password };
    try {
      const response = await apiPost<AuthResponse>("/auth/register", payload);
      setAccessToken(response.access_token);
      setToken(response.access_token);
      logInfo("WEB_AUTH_REG_OK", "Registration succeeded", {
        method: "POST",
        url: "/auth/register",
      });
      const completed = await fetchTutorialStatus();
      if (completed === false) {
        navigate("/tutorial", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      setLastAuthDiagnostic("/auth/register", "POST", error);
      logError("WEB_AUTH_REG_FAIL", "Registration failed", {
        method: "POST",
        url: "/auth/register",
        status: (error as { status?: number }).status ?? null,
        server_request_id: (error as { requestId?: string }).requestId ?? null,
        client_request_id:
          (error as { clientRequestId?: string }).clientRequestId ?? null,
      });
      throw error;
    }
  }, [navigate]);

  const logout = useCallback(() => {
    clearAccessToken();
    setToken(null);
    setTutorialCompleted(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  const markTutorialComplete = useCallback(() => {
    setTutorialCompleted(true);
  }, []);

  const value = useMemo(
    () => ({
      token,
      login,
      register,
      logout,
      markTutorialComplete,
    }),
    [token, login, register, logout, markTutorialComplete],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
