function readTokenFromParams(rawParams: string | null | undefined): string {
  const params = new URLSearchParams((rawParams ?? "").trim().replace(/^\?/, ""));
  return params.get("token")?.trim() ?? "";
}

export function extractTokenFromAuthLink(locationParts: {
  search?: string | null;
  hash?: string | null;
}): string {
  const searchToken = readTokenFromParams(locationParts.search);
  if (searchToken) {
    return searchToken;
  }

  const rawHash = (locationParts.hash ?? "").trim().replace(/^#/, "");
  if (!rawHash) {
    return "";
  }

  const directHashToken = readTokenFromParams(rawHash);
  if (directHashToken) {
    return directHashToken;
  }

  const hashQueryIndex = rawHash.indexOf("?");
  if (hashQueryIndex >= 0) {
    return readTokenFromParams(rawHash.slice(hashQueryIndex + 1));
  }

  return "";
}
