const ACCESS = "taptile_access_token";
const REFRESH = "taptile_refresh_token";
const EMAIL = "taptile_user_email";
const USERNAME = "taptile_username";

let sessionInvalidHandler = null;

export function setSessionInvalidHandler(handler) {
  sessionInvalidHandler = handler;
}

export function notifySessionInvalid() {
  sessionInvalidHandler?.();
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH);
}

export function getStoredEmail() {
  return localStorage.getItem(EMAIL);
}

export function getStoredUsername() {
  return localStorage.getItem(USERNAME) || "";
}

export function setStoredUsername(name) {
  if (name) localStorage.setItem(USERNAME, name);
  else localStorage.removeItem(USERNAME);
}

export function setSession(accessToken, refreshToken, email) {
  localStorage.setItem(ACCESS, accessToken);
  localStorage.setItem(REFRESH, refreshToken);
  if (email) localStorage.setItem(EMAIL, email);
}

export function clearSession() {
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
  localStorage.removeItem(EMAIL);
  localStorage.removeItem(USERNAME);
}

export function hasSession() {
  return Boolean(getAccessToken());
}
