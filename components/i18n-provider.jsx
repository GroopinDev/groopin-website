"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

import {
  LANGUAGE_STORAGE_KEY,
  createTranslator,
  normalizeLocale
} from "../app/lib/i18n";

const I18nContext = createContext({
  locale: "en",
  setLocale: () => {},
  t: (key, params) => key
});

const getStoredLocale = () => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    return null;
  }
};

const getInitialLocale = () => {
  const stored = getStoredLocale();
  if (stored) return normalizeLocale(stored);
  if (typeof navigator === "undefined") return "en";
  return normalizeLocale(navigator.language || "en");
};

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(getInitialLocale);

  const setLocale = useCallback((nextLocale) => {
    const normalized = normalizeLocale(nextLocale);
    setLocaleState(normalized);
    if (typeof document !== "undefined") {
      document.documentElement.lang = normalized;
    }
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
      } catch {
        // ignore storage errors
      }
      window.dispatchEvent(
        new CustomEvent("language:changed", { detail: { locale: normalized } })
      );
    }
  }, []);

  const t = useMemo(() => createTranslator(locale), [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t
    }),
    [locale, setLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
