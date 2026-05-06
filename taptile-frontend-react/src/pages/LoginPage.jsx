import { useEffect, useLayoutEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as storage from "../auth/storage.js";
import { LoginForm } from "../components/LoginForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const AUTH_SWITCH_STATE = { authSwitch: true };

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, email } = useAuth();
  const { t } = useLanguage();
  const [passwordClearTick, setPasswordClearTick] = useState(0);
  const from = location.state?.from?.pathname || "/";
  const target = from.startsWith("/") ? from : "/";

  useLayoutEffect(() => {
    if (!location.state?.authSwitch) return;
    setPasswordClearTick((n) => n + 1);
    const { authSwitch: _a, ...rest } = location.state;
    navigate(location.pathname, {
      replace: true,
      state: Object.keys(rest).length ? rest : undefined
    });
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    if (email && storage.getAccessToken()) {
      navigate(target, { replace: true });
    }
  }, [email, target, navigate]);

  return (
    <main className="page narrow-page">
      <section className="panel">
        <h1 className="page-title">{t("login.title")}</h1>
        <p className="page-muted">{t("login.subtitle")}</p>
        <LoginForm passwordClearTick={passwordClearTick} onSuccess={login} />
        <p className="page-footer-link">
          {t("login.noAccount")}{" "}
          <Link
            to="/register"
            state={AUTH_SWITCH_STATE}
            onClick={() => setPasswordClearTick((n) => n + 1)}
          >
            {t("login.registerLink")}
          </Link>
        </p>
      </section>
    </main>
  );
}
