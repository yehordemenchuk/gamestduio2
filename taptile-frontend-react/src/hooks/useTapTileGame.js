import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "../api/http.js";
import { GAME_NAME, BOARD_SIZE, ROUND_SECONDS } from "../constants.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";

function formatDateNow() {
  return new Date().toISOString();
}

export function useTapTileGame(playerName) {
  const { t } = useLanguage();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [activeTile, setActiveTile] = useState(-1);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameMessage, setGameMessage] = useState("");

  const intervalRef = useRef(null);
  const scoreRef = useRef(0);
  const roundFinishedRef = useRef(false);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const boardIndices = useMemo(() => Array.from({ length: BOARD_SIZE }, (_, i) => i), []);

  const pickTile = useCallback(() => {
    setActiveTile(Math.floor(Math.random() * BOARD_SIZE));
  }, []);

  const saveScore = useCallback(async (name, points) => {
    await apiFetch("/scores/", {
      method: "POST",
      body: JSON.stringify({
        game: GAME_NAME,
        player: name,
        points,
        playedOn: formatDateNow()
      })
    });
  }, []);

  const stopGame = useCallback(() => {
    setGameRunning(false);
    setActiveTile(-1);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const finishGame = useCallback(
    async (name) => {
      stopGame();
      const points = scoreRef.current;
      setGameMessage(t("game.roundOver", { points }));
      try {
        await saveScore(name, points);
        setGameMessage(t("game.roundSaved", { points }));
      } catch (error) {
        setGameMessage(t("game.saveFailed", { points, message: error.message }));
      }
    },
    [saveScore, stopGame, t]
  );

  const handleStartRound = useCallback(() => {
    const name = playerName?.trim();
    if (!name) {
      setGameMessage(t("game.notSignedIn"));
      return;
    }

    stopGame();
    roundFinishedRef.current = false;
    setScore(0);
    scoreRef.current = 0;
    setTimeLeft(ROUND_SECONDS);
    setGameMessage("");
    setGameRunning(true);
    pickTile();

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        const next = prev - 1;
        if (next <= 0) {
          if (!roundFinishedRef.current) {
            roundFinishedRef.current = true;
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            finishGame(name);
          }
          return 0;
        }
        return next;
      });
    }, 1000);
  }, [finishGame, pickTile, playerName, stopGame, t]);

  const handleTileClick = useCallback(
    (index) => {
      if (!gameRunning) return;
      if (index !== activeTile) return;
      setScore((prev) => {
        const next = prev + 1;
        scoreRef.current = next;
        return next;
      });
      pickTile();
    },
    [activeTile, gameRunning, pickTile]
  );

  useEffect(() => () => stopGame(), [stopGame]);

  return {
    score,
    timeLeft,
    activeTile,
    gameRunning,
    gameMessage,
    boardIndices,
    handleStartRound,
    handleTileClick
  };
}
