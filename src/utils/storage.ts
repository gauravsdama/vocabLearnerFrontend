/**
 * Auth storage utilities.
 *
 * Security model:
 * - access_token and refresh_token are stored as httpOnly cookies by the
 *   backend. They are never readable by JavaScript, preventing XSS-based
 *   token theft.
 * - client_signing_key is a per-session HMAC key used to sign API requests.
 *   It is stored in sessionStorage (cleared when the tab/window closes) rather
 *   than localStorage so it is not persisted across sessions.
 * - The access token value is also held in React state (in-memory only) so
 *   that the signing logic can verify a session is active.
 */

const CLIENT_SIGNING_KEY = "vocab_client_signing_key";

// ---------------------------------------------------------------------------
// Client signing key  (sessionStorage — cleared on tab close)
// ---------------------------------------------------------------------------

export function getClientSigningKey(): string | null {
  try {
    return sessionStorage.getItem(CLIENT_SIGNING_KEY);
  } catch {
    return null;
  }
}

export function setClientSigningKey(key: string) {
  try {
    sessionStorage.setItem(CLIENT_SIGNING_KEY, key);
  } catch {
    // ignore storage errors
  }
}

export function clearClientSigningKey() {
  try {
    sessionStorage.removeItem(CLIENT_SIGNING_KEY);
  } catch {
    // ignore storage errors
  }
}

// ---------------------------------------------------------------------------
// Full auth storage clear (called on logout / session expiry)
// ---------------------------------------------------------------------------

export function clearAuthStorage() {
  clearClientSigningKey();
}
