import { useLayoutEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { registerRequest } from "../api/authApi.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const AUTH_SWITCH_STATE = { authSwitch: true };

export function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    if (!location.state?.authSwitch) return;
    setPassword("");
    const { authSwitch: _a, ...rest } = location.state;
    navigate(location.pathname, {
      replace: true,
      state: Object.keys(rest).length ? rest : undefined
    });
  }, [location.state, location.pathname, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerRequest({
        username: username.trim(),
        email: email.trim(),
        plainPassword: password,
        userRole: "ROLE_USER"
      });
      navigate("/login", { replace: true, state: AUTH_SWITCH_STATE });
    } catch (err) {
      setError(err.message || t("register.failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page narrow-page">
      <section className="panel">
        <h1 className="page-title">{t("register.title")}</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field-label">
            {t("register.username")}
            <input
              className="field-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={1}
            />
          </label>
          <label className="field-label">
            {t("register.email")}
            <input className="field-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="field-label">
            {t("register.password")}
            <input
              className="field-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={1}
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "…" : t("register.submit")}
          </button>
        </form>
        <p className="page-footer-link">
          {t("register.hasAccount")}{" "}
          <Link to="/login" state={AUTH_SWITCH_STATE}>
            {t("register.signInLink")}
          </Link>
        </p>
      </section>
    </main>
  );
}
