import { Link, Outlet, useNavigate } from "react-router-dom";
import * as storage from "../auth/storage.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export function Layout() {
  const { email, playerName, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const authed = Boolean(storage.getAccessToken() && (email || storage.getStoredEmail()));

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-root">
      <div className="app-bg" aria-hidden="true" />
      <header className="site-nav">
        <Link to="/" className="site-logo">
          TapTile
        </Link>
        <nav className="site-nav-links">
          <Link to="/">{t("nav.home")}</Link>
          {authed ? (
            <>
              <Link to="/play">{t("nav.play")}</Link>
              <Link to="/community">{t("nav.community")}</Link>
            </>
          ) : null}
          {!authed ? (
            <>
              <Link to="/login">{t("nav.signIn")}</Link>
              <Link to="/register">{t("nav.register")}</Link>
            </>
          ) : (
            <>
              <span className="site-nav-user" title={email || undefined}>
                {playerName || email}
              </span>
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
                {t("nav.signOut")}
              </button>
            </>
          )}
          <div className="lang-switch" role="group" aria-label={t("lang.switchAria")}>
            <button
              type="button"
              className={`lang-btn ${lang === "en" ? "is-active" : ""}`}
              onClick={() => setLang("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={`lang-btn ${lang === "sk" ? "is-active" : ""}`}
              onClick={() => setLang("sk")}
            >
              SK
            </button>
          </div>
        </nav>
      </header>
      <div className="page-outlet">
        <Outlet />
      </div>
    </div>
  );
}
