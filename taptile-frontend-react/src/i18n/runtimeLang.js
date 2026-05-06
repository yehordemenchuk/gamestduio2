/** Keeps API-layer code (e.g. parseApiError) aligned with UI language without React context. */

const STORAGE_KEY = "taptile_lang";

function readStoredLang() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "sk" ? "sk" : "en";
  } catch {
    return "en";
  }
}

let runtimeLang = readStoredLang();

export function setRuntimeLang(lang) {
  runtimeLang = lang === "sk" ? "sk" : "en";
}

export function getRuntimeLang() {
  return runtimeLang;
}
