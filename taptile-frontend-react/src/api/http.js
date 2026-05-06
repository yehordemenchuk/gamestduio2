import { API_BASE_URL } from "./config.js";
import { getErrorMessageFromResponse } from "./parseApiError.js";
import * as storage from "../auth/storage.js";

let refreshInFlight = null;

async function refreshAccessToken() {
  const refreshToken = storage.getRefreshToken();
  if (!refreshToken) return false;

  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken })
      });
      if (!res.ok) return false;
      const data = await res.json();
      storage.setSession(data.accessToken, data.refreshToken, storage.getStoredEmail());
      return true;
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

/**
 * Authenticated API call. On 401/403: tries refresh once, then retries the same request.
 * If refresh fails: clears session and triggers session-invalid UI (re-login modal).
 */
export async function apiFetch(path, options = {}) {
  const { skipAuth = false, _retry = false, headers: initHeaders, ...rest } = options;

  const headers = new Headers(initHeaders || {});
  if (rest.body && typeof rest.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!skipAuth) {
    const access = storage.getAccessToken();
    if (access) {
      headers.set("Authorization", `Bearer ${access}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers
  });

  if (response.ok) {
    if (response.status === 204) return null;
    const ct = response.headers.get("content-type");
    if (ct && ct.includes("application/json")) {
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    }
    return null;
  }

  const authPath = path.startsWith("/auth/");
  const shouldTryRefresh =
    !skipAuth && !_retry && !authPath && (response.status === 401 || response.status === 403);

  if (shouldTryRefresh) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiFetch(path, { ...options, _retry: true });
    }
    storage.clearSession();
    storage.notifySessionInvalid();
  }

  const errText = await response.text();
  throw new Error(getErrorMessageFromResponse(errText, response.status));
}
