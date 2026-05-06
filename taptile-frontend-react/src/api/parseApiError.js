/**
 * User-facing errors only — no URLs, paths, or HTTP jargon where avoidable.
 * Wording follows the active UI language (synced via setRuntimeLang in LanguageProvider).
 */

import { STRINGS } from "../i18n/locales.js";
import { getRuntimeLang } from "../i18n/runtimeLang.js";

function te(key) {
  const L = getRuntimeLang();
  const table = STRINGS[L] || STRINGS.en;
  return table[key] ?? STRINGS.en[key] ?? key;
}

function hintFromBackendPath(pathClean) {
  if (!pathClean) return null;
  const p = pathClean.toLowerCase();
  if (p.includes("/ratings")) return te("errors.ratingHint");
  if (p.includes("/comments")) return te("errors.commentHint");
  if (p.includes("/scores")) return te("errors.scoreHint");
  if (p.includes("/users/")) return te("errors.userProfileHint");
  if (p.includes("/users")) return te("errors.registerHint");
  if (p.includes("/auth/login") || p.endsWith("/auth/login")) return te("errors.loginHint");
  if (p.includes("/auth/")) return te("errors.authHint");
  return null;
}

/** Hide noisy Spring boilerplate when details carry the real info */
function isBoilerplateMessage(msg) {
  const m = msg.trim().toLowerCase();
  return m === "invalid argument error";
}

export function getErrorMessageFromResponse(bodyText, httpStatus) {
  const statusNum = typeof httpStatus === "number" ? httpStatus : Number(httpStatus);
  const genericTryAgain =
    Number.isFinite(statusNum) && statusNum >= 500 ? te("errors.genericTryAgainServer") : te("errors.genericTryAgain");

  if (bodyText == null || String(bodyText).trim() === "") {
    return genericTryAgain;
  }

  const raw = String(bodyText).trim();

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return raw.length > 600 ? `${raw.slice(0, 600)}…` : raw;
  }

  if (!data || typeof data !== "object") {
    return genericTryAgain;
  }

  const pathRaw = typeof data.path === "string" ? data.path : "";
  const pathClean = pathRaw.replace(/^uri=/, "");

  const detailEntries =
    data.details && typeof data.details === "object"
      ? Object.entries(data.details).filter(([, v]) => v != null && String(v).trim() !== "")
      : [];

  const detailSentence = detailEntries.map(([k, v]) => `${formatFieldLabel(k)}: ${v}`).join(" ");

  let primary =
    typeof data.message === "string" && data.message.trim() !== "" ? data.message.trim() : "";

  if (primary && isBoilerplateMessage(primary)) {
    primary = "";
  }

  if (detailSentence) {
    if (primary) {
      return `${primary} ${detailSentence}`.trim();
    }
    return `${te("errors.adjustInputPrefix")} ${detailSentence}`;
  }

  if (primary) {
    return primary;
  }

  const statusName = typeof data.status === "string" ? data.status : "";

  if (statusName === "BAD_REQUEST") {
    return hintFromBackendPath(pathClean) ?? te("errors.badRequestGeneric");
  }
  if (statusName === "NOT_FOUND") {
    return te("errors.notFound");
  }
  if (statusName === "INTERNAL_SERVER_ERROR") {
    return te("errors.internalServer");
  }

  if (statusName === "UNAUTHORIZED" || statusNum === 401) {
    return te("errors.unauthorized");
  }
  if (statusNum === 403) {
    return te("errors.forbidden");
  }

  const contextual = hintFromBackendPath(pathClean);
  if (contextual) return contextual;

  return genericTryAgain;
}

function formatFieldLabel(field) {
  if (!field || typeof field !== "string") return te("errors.fieldLabel");
  return field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim();
}
