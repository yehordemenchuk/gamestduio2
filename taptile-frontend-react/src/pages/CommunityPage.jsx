import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../api/http.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { COMMENTS_POLL_MS, GAME_NAME } from "../constants.js";

function formatDateNow() {
  return new Date().toISOString();
}

export function CommunityPage() {
  const { email, playerName } = useAuth();
  const { t } = useLanguage();

  const [avgRating, setAvgRating] = useState("—");
  const [ratingValue, setRatingValue] = useState(5);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState(null);
  const [toast, setToast] = useState("");

  const loadAverageRating = useCallback(async () => {
    try {
      const data = await apiFetch(`/ratings/avg/${GAME_NAME}`);
      if (data && typeof data.averageRating === "number") {
        setAvgRating(data.averageRating.toFixed(2));
        return;
      }
      setAvgRating("—");
    } catch {
      setAvgRating("—");
    }
  }, []);

  const loadComments = useCallback(async () => {
    setCommentsLoading(true);
    setCommentsError(null);
    try {
      const data = await apiFetch(`/comments/by-game/${GAME_NAME}`);
      const normalized = Array.isArray(data) ? data : [];
      setComments(normalized.slice(-20).reverse());
    } catch (e) {
      setComments([]);
      setCommentsError(e.message);
    } finally {
      setCommentsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAverageRating();
    loadComments();
  }, [loadAverageRating, loadComments]);

  useEffect(() => {
    const id = setInterval(loadComments, COMMENTS_POLL_MS);
    return () => clearInterval(id);
  }, [loadComments]);

  async function handleSendRating() {
    if (!email || !playerName) return;
    if (Number.isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5) {
      setToast(t("community.ratingRange"));
      return;
    }
    setToast("");
    try {
      await apiFetch("/ratings/", {
        method: "POST",
        body: JSON.stringify({
          game: GAME_NAME,
          player: playerName,
          rating: ratingValue,
          ratedOn: formatDateNow()
        })
      });
      setToast(t("community.ratingSaved"));
      await loadAverageRating();
    } catch (e) {
      setToast(e.message);
    }
  }

  async function handleSendComment() {
    if (!email || !playerName) return;
    const text = commentText.trim();
    if (!text) {
      setToast(t("community.commentEmpty"));
      return;
    }
    setToast("");
    try {
      await apiFetch("/comments/", {
        method: "POST",
        body: JSON.stringify({
          game: GAME_NAME,
          player: playerName,
          comment: text,
          datedOn: formatDateNow()
        })
      });
      setCommentText("");
      setToast(t("community.commentPosted"));
      await loadComments();
    } catch (e) {
      setToast(e.message);
    }
  }

  return (
    <main className="page community-page">
      <h1 className="page-title">{t("community.title")}</h1>
      <p className="page-muted">{t("community.subtitle")}</p>
      {toast ? <p className="game-toast">{toast}</p> : null}

      <div className="community-grid">
        <section className="panel">
          <h2 className="panel-title">{t("community.rating")}</h2>
          <p className="rating-avg">
            {t("community.average")} <strong>{avgRating}</strong> {t("community.outOf5")}
          </p>
          <div className="rating-row">
            <input
              className="input-num"
              type="number"
              min={0}
              max={5}
              value={ratingValue}
              onChange={(e) => setRatingValue(Number(e.target.value))}
            />
            <button type="button" className="btn btn-secondary" onClick={handleSendRating}>
              {t("community.submitRating")}
            </button>
          </div>
        </section>

        <section className="panel comments-panel-page">
          <div className="comments-header">
            <h2 className="panel-title">{t("community.comments")}</h2>
            <span className={`comments-live ${commentsLoading ? "is-pulse" : ""}`}>{t("community.live")}</span>
          </div>
          <div className="comments-compose">
            <textarea
              className="comments-textarea"
              rows={3}
              maxLength={250}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t("community.commentPlaceholder")}
            />
            <button type="button" className="btn btn-primary" onClick={handleSendComment}>
              {t("community.post")}
            </button>
          </div>
          {commentsError ? <p className="comments-err">{commentsError}</p> : null}
          <ul className="comments-feed-page">
            {comments.length === 0 && !commentsLoading ? (
              <li className="comments-empty">{t("community.noComments")}</li>
            ) : (
              comments.map((item) => (
                <li key={item.id} className="comment-item">
                  <span className="comment-author">{item.player}</span>
                  <p className="comment-body">{item.comment}</p>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </main>
  );
}
