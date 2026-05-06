import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { useTapTileGame } from "../hooks/useTapTileGame.js";

export function PlayPage() {
  const { playerName } = useAuth();
  const { t } = useLanguage();
  const game = useTapTileGame(playerName);

  return (
    <main className="page play-page">
      <header className="page-header-inline">
        <div>
          <h1 className="page-title">{t("play.title")}</h1>
          <p className="page-muted">{t("play.signedInAs", { player: playerName })}</p>
        </div>
      </header>

      <section className="panel game-panel">
        <div className="game-toolbar">
          <div className="stat-pills">
            <span className="stat-pill">
              {t("play.score")} <strong>{game.score}</strong>
            </span>
            <span className="stat-pill">
              {t("play.time")} <strong>
                {game.timeLeft}
                {t("play.seconds")}
              </strong>
            </span>
          </div>
          <button type="button" className="btn btn-primary" onClick={game.handleStartRound} disabled={game.gameRunning}>
            {game.gameRunning ? t("play.playing") : t("play.startRound")}
          </button>
        </div>

        <div className="board" aria-label={t("play.boardAria")}>
          {game.boardIndices.map((index) => (
            <button
              key={index}
              type="button"
              className={`tile ${game.activeTile === index ? "active" : ""}`}
              onClick={() => game.handleTileClick(index)}
              aria-pressed={game.activeTile === index}
            />
          ))}
        </div>
        {game.gameMessage ? <p className="game-toast">{game.gameMessage}</p> : null}
      </section>
    </main>
  );
}
