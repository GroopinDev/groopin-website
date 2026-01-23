"use client";

import { useEffect } from "react";

import { useI18n } from "./i18n-provider";
import { normalizeLocale } from "../app/lib/i18n";

export default function LanguageSync({ locale }) {
  const { locale: currentLocale, setLocale } = useI18n();

  useEffect(() => {
    if (!locale) return;
    const nextLocale = normalizeLocale(locale);
    if (nextLocale !== currentLocale) {
      setLocale(nextLocale);
    }
  }, [locale, currentLocale, setLocale]);

  return null;
}
