import { useNavigate } from "react-router-dom";
import { LoginForm } from "./LoginForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export function SessionModal() {
  const { reloginOpen, closeReloginModal, login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!reloginOpen) return null;

  return (
    <div className="session-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="session-modal-title">
      <div className="session-modal-card">
        <h2 id="session-modal-title" className="session-modal-title">
          {t("session.title")}
        </h2>
        <p className="session-modal-text">{t("session.text")}</p>
        <LoginForm
          submitLabel={t("session.signInAgain")}
          onSuccess={async (email, password) => {
            await login(email, password);
            closeReloginModal();
          }}
        />
        <button
          type="button"
          className="btn btn-ghost btn-block session-modal-secondary"
          onClick={() => {
            closeReloginModal();
            navigate("/login", { replace: true });
          }}
        >
          {t("session.goLogin")}
        </button>
      </div>
    </div>
  );
}
