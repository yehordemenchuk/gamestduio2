import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { STRINGS } from "./locales.js";
import { setRuntimeLang } from "./runtimeLang.js";

const STORAGE_KEY = "taptile_lang";

const LanguageContext = createContext(null);

function applyTemplate(str, vars) {
  if (!vars || !str) return str;
  let acc = str;
  for (const key of Object.keys(vars)) {
    const val = String(vars[key]);
    const token = `{${key}}`;
    let i = acc.indexOf(token);
    while (i !== -1) {
      acc = acc.slice(0, i) + val + acc.slice(i + token.length);
      i = acc.indexOf(token);
    }
  }
  return acc;
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "sk" || stored === "en") return stored;
    return "en";
  });

  const setLang = useCallback((next) => {
    if (next !== "en" && next !== "sk") return;
    localStorage.setItem(STORAGE_KEY, next);
    setLangState(next);
  }, []);

  const t = useCallback(
    (key, vars) => {
      const table = STRINGS[lang] || STRINGS.en;
      const fallback = STRINGS.en[key];
      const raw = table[key] ?? fallback ?? key;
      return applyTemplate(raw, vars);
    },
    [lang]
  );

  useEffect(() => {
    document.documentElement.lang = lang;
    setRuntimeLang(lang);
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
