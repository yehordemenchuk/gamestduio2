import bcrypt from "bcryptjs";

async function sha256Hex(plain) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Secure context required: open app via HTTPS or localhost.");
  }
  const data = new TextEncoder().encode(plain);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Value stored in DB (client sends this on register): BCrypt( SHA-256(plain) ).
 * Matches Spring BCryptPasswordEncoder.matches(secret, encoded) when secret is SHA-256(plain).
 */
export async function hashPasswordForRegister(plain) {
  const secret = await sha256Hex(plain);
  return bcrypt.hashSync(secret, 10);
}

/** Send on login as `password` — never send the raw password over the wire. */
export async function hashPasswordForLogin(plain) {
  return sha256Hex(plain);
}
