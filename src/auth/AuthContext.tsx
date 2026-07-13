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
import {
  apiDelete,
  apiGet,
  apiPost,
  setAuthToken,
  setTokenRefreshHandler,
  setUnauthorizedHandler,
} from "../api/client";
import type {
  AccountDeletionRequest,
  AuthResponse,
  ForgotPasswordRequest,
  GoogleAuthRequest,
  LoginRequest,
  LogoutRequest,
  MessageResponse,
  RefreshRequest,
  RegisterRequest,
  ResendEmailVerificationResponse,
  ResetPasswordRequest,
  TutorialStatusResponse,
  User,
  VerifyEmailCodeRequest,
  VerifyEmailResponse,
} from "../api/types";
import { logError, logInfo } from "../utils/logger";
import {
  clearAuthStorage,
  clearClientSigningKey,
  setClientSigningKey,
} from "../utils/storage";
import { clearLastAuthDiagnostic, setLastAuthDiagnostic } from "../utils/diagnostics";

type AuthContextValue = {
  token: string | null;
  user: User | null;
  loading: boolean;
  needsEmailVerification: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: { email: string; password: string; displayName?: string }) => Promise<void>;
  authenticateWithGoogle: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  resendVerification: () => Promise<ResendEmailVerificationResponse>;
  verifyEmailCode: (code: string) => Promise<VerifyEmailResponse>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (token: string, newPassword: string) => Promise<string>;
  deleteAccount: () => Promise<void>;
  refreshCurrentUser: () => Promise<User | null>;
  markEmailVerified: () => Promise<void>;
  markTutorialComplete: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function isVerified(user: User | null) {
  return Boolean(user && user.email_verified !== false);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  // token is kept in React state ONLY (not persisted to localStorage).
  // The httpOnly auth cookies managed by the backend are the durable session store.
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tutorialCompleted, setTutorialCompleted] = useState<boolean | null>(null);
  const tutorialCheckInFlight = useRef(false);
  const refreshPromiseRef = useRef<Promise<boolean> | null>(null);
  const refreshTokenRef = useRef<string | null>(null);

  const clearSessionState = useCallback(() => {
    clearAuthStorage();
    setAuthToken(null);
    refreshTokenRef.current = null;
    setToken(null);
    setUser(null);
    setTutorialCompleted(null);
  }, []);

  const applySession = useCallback((response: AuthResponse) => {
    // Tokens live in httpOnly cookies (set by the server) — never in localStorage.
    // We keep the access token in React state only for in-memory session tracking,
    // as a Bearer fallback for split-domain deployments, and the signing key in
    // sessionStorage for request signing.
    if (response.client_signing_key) {
      setClientSigningKey(response.client_signing_key);
    } else {
      clearClientSigningKey();
    }
    setAuthToken(response.access_token);
    refreshTokenRef.current = response.refresh_token || null;
    setToken(response.access_token);
    setUser(response.user);
    if (response.user.email_verified === false) {
      setTutorialCompleted(null);
    }
    return response.user;
  }, []);

  const fetchTutorialStatus = useCallback(async () => {
    if (tutorialCheckInFlight.current || !token || !isVerified(user)) {
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
  }, [token, user]);

  const navigateAfterVerifiedAuth = useCallback(async () => {
    const completed = await fetchTutorialStatus();
    if (completed === false) {
      navigate("/tutorial", { replace: true });
      return;
    }
    navigate("/", { replace: true });
  }, [fetchTutorialStatus, navigate]);

  const refreshCurrentUser = useCallback(async () => {
    // No localStorage check — rely on the httpOnly cookie being present.
    // If the cookie is absent or expired, this will throw a 401 which the
    // caller handles.
    const me = await apiGet<User>("/auth/me");
    setUser(me);
    return me;
  }, []);

  const refreshSession = useCallback(async () => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }
    const promise = (async () => {
      try {
        const payload: RefreshRequest = {
          refresh_token: refreshTokenRef.current,
        };
        const response = await apiPost<AuthResponse>("/auth/refresh", payload, {
          omitAuth: true,
          skipAuthRefresh: true,
        });
        applySession(response);
        return true;
      } catch {
        clearSessionState();
        return false;
      } finally {
        refreshPromiseRef.current = null;
      }
    })();
    refreshPromiseRef.current = promise;
    return promise;
  }, [applySession, clearSessionState]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSessionState();
      navigate("/login", { replace: true });
    });
    setTokenRefreshHandler(() => refreshSession());
    return () => {
      setUnauthorizedHandler(() => {});
      setTokenRefreshHandler(null);
    };
  }, [clearSessionState, navigate, refreshSession]);

  useEffect(() => {
    let cancelled = false;

    async function hydrateSession() {
      // Auth tokens live in httpOnly cookies — no localStorage to check.
      // Attempt a silent refresh to restore the in-memory session state.
      // If the refresh cookie is absent or expired the server returns 401
      // and we fall through to the unauthenticated state.
      try {
        const payload: RefreshRequest = {
          refresh_token: refreshTokenRef.current,
        };
        const response = await apiPost<AuthResponse>("/auth/refresh", payload, {
          omitAuth: true,
          skipAuthRefresh: true,
        });
        if (!cancelled) {
          applySession(response);
        }
      } catch {
        // No valid session cookie — user needs to log in.
        if (!cancelled) {
          clearSessionState();
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void hydrateSession();

    return () => {
      cancelled = true;
    };
  }, [clearSessionState, refreshCurrentUser, refreshSession]);

  useEffect(() => {
    if (!token || !isVerified(user)) {
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
  }, [token, user, tutorialCompleted, location.pathname, fetchTutorialStatus, navigate]);

  const login = useCallback(async (email: string, password: string) => {
    clearLastAuthDiagnostic();
    logInfo("WEB_AUTH_LOGIN_START", "Login started", {
      method: "POST",
      url: "/auth/login",
    });
    const payload: LoginRequest = { email, password };
    try {
      const response = await apiPost<AuthResponse>("/auth/login", payload, {
        omitAuth: true,
        skipAuthRefresh: true,
      });
      const nextUser = applySession(response);
      logInfo("WEB_AUTH_LOGIN_OK", "Login succeeded", {
        method: "POST",
        url: "/auth/login",
      });
      if (!isVerified(nextUser)) {
        navigate("/check-email", { replace: true });
        return;
      }
      await navigateAfterVerifiedAuth();
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
  }, [applySession, navigate, navigateAfterVerifiedAuth]);

  const register = useCallback(async ({ email, password, displayName }: { email: string; password: string; displayName?: string }) => {
    clearLastAuthDiagnostic();
    logInfo("WEB_AUTH_REG_START", "Registration started", {
      method: "POST",
      url: "/auth/register",
    });
    const payload: RegisterRequest = {
      email,
      password,
      ...(displayName ? { display_name: displayName } : {}),
    };
    try {
      const response = await apiPost<AuthResponse>("/auth/register", payload, {
        omitAuth: true,
        skipAuthRefresh: true,
      });
      const nextUser = applySession(response);
      logInfo("WEB_AUTH_REG_OK", "Registration succeeded", {
        method: "POST",
        url: "/auth/register",
      });
      if (!isVerified(nextUser)) {
        navigate("/check-email", {
          replace: true,
          state: { verificationCodeSent: true },
        });
        return;
      }
      await navigateAfterVerifiedAuth();
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
  }, [applySession, navigate, navigateAfterVerifiedAuth]);

  const authenticateWithGoogle = useCallback(async (credential: string) => {
    clearLastAuthDiagnostic();
    const payload: GoogleAuthRequest = { credential };
    try {
      const response = await apiPost<AuthResponse>("/auth/google", payload, {
        omitAuth: true,
        skipAuthRefresh: true,
      });
      const nextUser = applySession(response);
      if (!isVerified(nextUser)) {
        navigate("/check-email", { replace: true });
        return;
      }
      await navigateAfterVerifiedAuth();
    } catch (error) {
      setLastAuthDiagnostic("/auth/google", "POST", error);
      throw error;
    }
  }, [applySession, navigate, navigateAfterVerifiedAuth]);

  const logout = useCallback(async () => {
    try {
      const payload: LogoutRequest = {
        refresh_token: refreshTokenRef.current,
      };
      await apiPost<MessageResponse>(
        "/auth/logout",
        payload,
        { skipAuthRefresh: true },
      );
    } catch {
      // Server-side revocation is best-effort; local state is always cleared.
    }
    clearSessionState();
    navigate("/login", { replace: true });
  }, [clearSessionState, navigate]);

  const deleteAccount = useCallback(async () => {
    const payload: AccountDeletionRequest = { confirmation: "DELETE" };
    await apiDelete<MessageResponse>("/users/me", payload, {
      skipAuthRefresh: true,
    });
    clearSessionState();
    navigate("/login", { replace: true });
  }, [clearSessionState, navigate]);

  const resendVerification = useCallback(async () => {
    return apiPost<ResendEmailVerificationResponse>(
      "/auth/resend-verification",
      undefined,
      { skipAuthRefresh: true },
    );
  }, []);

  const verifyEmailCode = useCallback(async (code: string) => {
    const payload: VerifyEmailCodeRequest = { code };
    const response = await apiPost<VerifyEmailResponse>(
      "/auth/verify-email-code",
      payload,
      { skipAuthRefresh: true },
    );
    const me = await refreshCurrentUser();
    if (me) {
      setUser(me);
    }
    return response;
  }, [refreshCurrentUser]);

  const forgotPassword = useCallback(async (email: string) => {
    const payload: ForgotPasswordRequest = { email };
    const response = await apiPost<MessageResponse>("/auth/forgot-password", payload, {
      omitAuth: true,
      skipAuthRefresh: true,
    });
    return response.message;
  }, []);

  const resetPassword = useCallback(async (resetToken: string, newPassword: string) => {
    const payload: ResetPasswordRequest = { token: resetToken, new_password: newPassword };
    const response = await apiPost<MessageResponse>("/auth/reset-password", payload, {
      omitAuth: true,
      skipAuthRefresh: true,
    });
    return response.message;
  }, []);

  const markEmailVerified = useCallback(async () => {
    const me = await refreshCurrentUser();
    if (me) {
      setUser(me);
    }
  }, [refreshCurrentUser]);

  const markTutorialComplete = useCallback(() => {
    setTutorialCompleted(true);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      needsEmailVerification: Boolean(token && user && user.email_verified === false),
      login,
      register,
      authenticateWithGoogle,
      logout,
      resendVerification,
      verifyEmailCode,
      forgotPassword,
      resetPassword,
      deleteAccount,
      refreshCurrentUser,
      markEmailVerified,
      markTutorialComplete,
    }),
    [
      token,
      user,
      loading,
      login,
      register,
      authenticateWithGoogle,
      logout,
      resendVerification,
      verifyEmailCode,
      forgotPassword,
      resetPassword,
      deleteAccount,
      refreshCurrentUser,
      markEmailVerified,
      markTutorialComplete,
    ],
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
