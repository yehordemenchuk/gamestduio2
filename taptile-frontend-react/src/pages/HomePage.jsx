import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/http.js";
import * as storage from "../auth/storage.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { GAME_NAME, ROUND_SECONDS } from "../constants.js";

export function HomePage() {
  const { email } = useAuth();
  const { t } = useLanguage();
  const authed = Boolean(storage.getAccessToken() && (email || storage.getStoredEmail()));

  const [scores, setScores] = useState([]);
  const [scoresError, setScoresError] = useState(null);
  const [scoresLoading, setScoresLoading] = useState(false);

  const loadScores = useCallback(async () => {
    if (!authed) return;
    setScoresLoading(true);
    setScoresError(null);
    try {
      const data = await apiFetch(`/scores/top/${GAME_NAME}`);
      setScores(Array.isArray(data) ? data.slice(0, 10) : []);
    } catch (e) {
      setScores([]);
      setScoresError(e.message);
    } finally {
      setScoresLoading(false);
    }
  }, [authed]);

  useEffect(() => {
    loadScores();
  }, [loadScores]);

  return (
    <main className="page home-page home-with-sidebar">
      <div className="home-main">
        <section className="panel hero-panel">
          <p className="intro-badge">{t("home.badge")}</p>
          <h1 className="hero-title">TapTile</h1>
          <p className="hero-lead">{t("home.heroLead")}</p>
          <div className="hero-actions">
            {authed ? (
              <Link to="/play" className="btn btn-primary">
                {t("home.play")}
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary">
                  {t("home.signIn")}
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  {t("home.register")}
                </Link>
              </>
            )}
            {authed ? (
              <Link to="/community" className="btn btn-secondary">
                {t("home.community")}
              </Link>
            ) : null}
          </div>
        </section>

        <section className="panel home-section">
          <h2 className="home-section-title">{t("home.aboutTitle")}</h2>
          <p className="home-section-text">{t("home.aboutText")}</p>
        </section>

        <section className="panel home-section">
          <h2 className="home-section-title">{t("home.rulesTitle")}</h2>
          <ul className="home-rules-list">
            <li>
              <strong>{t("home.ruleDurationLabel")}</strong> {t("home.ruleDuration", { seconds: ROUND_SECONDS })}
            </li>
            <li>
              <strong>{t("home.ruleScoreLabel")}</strong> {t("home.ruleScore")}
            </li>
            <li>
              <strong>{t("home.ruleEndLabel")}</strong> {t("home.ruleEnd")}
            </li>
            <li>
              <strong>{t("home.ruleFairLabel")}</strong> {t("home.ruleFair")}
            </li>
          </ul>
        </section>

        <section className="panel home-section">
          <h2 className="home-section-title">{t("home.tipsTitle")}</h2>
          <ul className="home-rules-list">
            <li>{t("home.tip1")}</li>
            <li>{t("home.tip2")}</li>
            <li>{t("home.tip3")}</li>
          </ul>
        </section>

        <section className="panel home-section">
          <h2 className="home-section-title">{t("home.communityTitle")}</h2>
          <p className="home-section-text">{t("home.communityText")}</p>
        </section>
      </div>

      <aside className="home-sidebar panel" aria-label={t("home.leaderboardAria")}>
        <div className="home-sidebar-head">
          <h2 className="panel-title">{t("home.leaderboardTitle")}</h2>
          {authed ? (
            <button type="button" className="btn btn-sm btn-secondary" onClick={loadScores} disabled={scoresLoading}>
              {scoresLoading ? "…" : t("home.leaderboardRefresh")}
            </button>
          ) : null}
        </div>
        {!authed ? (
          <p className="home-sidebar-hint">{t("home.leaderboardHint")}</p>
        ) : scoresError ? (
          <p className="form-error">{scoresError}</p>
        ) : (
          <ul className="leader-list">
            {scores.length === 0 ? (
              <li className="leader-empty">{t("home.leaderboardEmpty")}</li>
            ) : (
              scores.map((item, idx) => (
                <li key={item.id ?? `${item.player}-${idx}`} className="leader-row">
                  <span className="leader-rank">{idx + 1}</span>
                  <span className="leader-name">{item.player}</span>
                  <span className="leader-points">{item.points}</span>
                </li>
              ))
            )}
          </ul>
        )}
      </aside>
    </main>
  );
}
