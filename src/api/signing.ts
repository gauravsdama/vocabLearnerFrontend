function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join(
    "",
  );
}

async function sha256Hex(value: string) {
  if (typeof crypto === "undefined" || !crypto.subtle) {
    throw new Error("Web Crypto is unavailable for request signing.");
  }
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return bytesToHex(new Uint8Array(digest));
}

async function hmacSha256Hex(key: string, value: string) {
  if (typeof crypto === "undefined" || !crypto.subtle) {
    throw new Error("Web Crypto is unavailable for request signing.");
  }
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(value),
  );
  return bytesToHex(new Uint8Array(signature));
}

type SignatureHeaderInput = {
  method: string;
  url: string;
  bodyText: string;
  signingKey: string;
  timestamp?: string;
  nonce?: string;
};

export function createClientNonce() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `nonce-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function buildSignatureHeaders({
  method,
  url,
  bodyText,
  signingKey,
  timestamp = String(Math.floor(Date.now() / 1000)),
  nonce = createClientNonce(),
}: SignatureHeaderInput) {
  const bodyHash = await sha256Hex(bodyText);
  const path = new URL(url).pathname;
  const payload = [method.toUpperCase(), path, timestamp, nonce, bodyHash].join(
    "\n",
  );
  const signature = await hmacSha256Hex(signingKey, payload);
  return {
    "X-Client-Timestamp": timestamp,
    "X-Client-Nonce": nonce,
    "X-Client-Signature": signature,
  };
}
