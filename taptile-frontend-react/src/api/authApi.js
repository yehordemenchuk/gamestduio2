import { hashPasswordForLogin, hashPasswordForRegister } from "../auth/passwordWire.js";
import { API_BASE_URL } from "./config.js";
import { getErrorMessageFromResponse } from "./parseApiError.js";

/** Unauthenticated — do not use apiFetch (would loop). */
export async function loginRequest(email, plainPassword) {
  const password = await hashPasswordForLogin(plainPassword);
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(getErrorMessageFromResponse(body, res.status));
  }
  return res.json();
}

export async function registerRequest({ username, email, plainPassword, userRole = "ROLE_USER" }) {
  const password = await hashPasswordForRegister(plainPassword);
  const res = await fetch(`${API_BASE_URL}/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, userRole })
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(getErrorMessageFromResponse(body, res.status));
  }
  return res.json();
}

export async function logoutRequest(refreshToken) {
  if (!refreshToken) return;
  const res = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(getErrorMessageFromResponse(body, res.status));
  }
}
