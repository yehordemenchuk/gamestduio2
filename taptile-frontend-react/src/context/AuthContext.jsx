import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loginRequest, logoutRequest } from "../api/authApi.js";
import { fetchUserByEmail } from "../api/userApi.js";
import * as storage from "../auth/storage.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const AuthContext = createContext(null);

function readUsername(profile) {
  if (!profile || typeof profile !== "object") return "";
  const u = profile.username;
  return typeof u === "string" ? u.trim() : "";
}

export function AuthProvider({ children }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState(() => storage.getStoredEmail() || "");
  const [username, setUsername] = useState(() => storage.getStoredUsername() || "");
  const [reloginOpen, setReloginOpen] = useState(false);

  useEffect(() => {
    storage.setSessionInvalidHandler(() => {
      setEmail("");
      setUsername("");
      setReloginOpen(true);
    });
    return () => storage.setSessionInvalidHandler(null);
  }, []);

  /** Load username for sessions that have tokens but no stored username (e.g. older localStorage). */
  useEffect(() => {
    if (!storage.getAccessToken() || !email) return;
    if (storage.getStoredUsername()) return;
    let cancelled = false;
    (async () => {
      try {
        const profile = await fetchUserByEmail(email);
        if (cancelled) return;
        const name = readUsername(profile);
        if (name) {
          storage.setStoredUsername(name);
          setUsername(name);
        }
      } catch {
        /* playerName falls back to email */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [email]);

  const login = useCallback(
    async (loginEmail, password) => {
      const data = await loginRequest(loginEmail, password);
      const accessToken = data?.accessToken ?? data?.access_token;
      const refreshToken = data?.refreshToken ?? data?.refresh_token;
      if (!accessToken || !refreshToken) {
        throw new Error(t("auth.missingTokens"));
      }
      storage.setSession(accessToken, refreshToken, loginEmail);
      setEmail(loginEmail);
      setReloginOpen(false);
      try {
        const profile = await fetchUserByEmail(loginEmail);
        const name = readUsername(profile);
        if (!name) {
          throw new Error(t("auth.profileFailed"));
        }
        storage.setStoredUsername(name);
        setUsername(name);
      } catch (e) {
        storage.clearSession();
        setEmail("");
        setUsername("");
        throw e;
      }
    },
    [t]
  );

  const logout = useCallback(async () => {
    try {
      const rt = storage.getRefreshToken();
      await logoutRequest(rt);
    } catch {
      /* still clear local session */
    }
    storage.clearSession();
    setEmail("");
    setUsername("");
    setReloginOpen(false);
  }, []);

  const closeReloginModal = useCallback(() => {
    setReloginOpen(false);
  }, []);

  const playerName = (username || email || "").trim();

  const value = useMemo(
    () => ({
      email,
      username,
      playerName,
      login,
      logout,
      reloginOpen,
      closeReloginModal
    }),
    [email, username, playerName, login, logout, reloginOpen, closeReloginModal]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
