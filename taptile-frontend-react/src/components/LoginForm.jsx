import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export function LoginForm({ onSuccess, submitLabel, className = "", passwordClearTick = 0 }) {
  const { t } = useLanguage();
  const label = submitLabel ?? t("login.submit");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (passwordClearTick > 0) {
      setPassword("");
    }
  }, [passwordClearTick]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSuccess(email.trim(), password);
      setPassword("");
    } catch (err) {
      setError(err.message || t("login.failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={`login-form ${className}`} onSubmit={handleSubmit}>
      <label className="field-label">
        {t("login.email")}
        <input
          className="field-input"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="field-label">
        {t("login.password")}
        <input
          className="field-input"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
        {loading ? "…" : label}
      </button>
    </form>
  );
}
