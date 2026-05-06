import { apiFetch } from "./http.js";

/**
 * GET /users/{email} — profile after login (requires Bearer token).
 */
export async function fetchUserByEmail(email) {
  const enc = encodeURIComponent(email.trim());
  return apiFetch(`/users/${enc}`);
}
