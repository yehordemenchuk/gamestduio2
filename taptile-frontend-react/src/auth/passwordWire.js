import bcrypt from "bcryptjs";
import { sha256 } from "js-sha256";

/** SHA-256 hex of UTF-8 string — works on HTTP (no Web Crypto / secure context). */
function sha256Hex(plain) {
  return sha256(plain);
}

/**
 * Value stored in DB (client sends this on register): BCrypt( SHA-256(plain) ).
 * Matches Spring BCryptPasswordEncoder.matches(secret, encoded) when secret is SHA-256(plain).
 */
export async function hashPasswordForRegister(plain) {
  const secret = sha256Hex(plain);
  return bcrypt.hashSync(secret, 10);
}

/** Send on login as `password` — never send the raw password over the wire. */
export async function hashPasswordForLogin(plain) {
  return sha256Hex(plain);
}
