/**
 * Auth storage utilities.
 *
 * Security model:
 * - access_token and refresh_token are stored as httpOnly cookies by the
 *   backend for durable sessions.
 * - access_token and refresh_token are also held in React refs/state only
 *   while the tab is open. This lets split-domain deployments send Bearer
 *   auth when browser cookie policy blocks cross-site API cookies.
 * - client_signing_key is a per-session HMAC key used to sign API requests.
 *   It is stored in sessionStorage (cleared when the tab/window closes) rather
 *   than localStorage so it is not persisted across sessions.
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
