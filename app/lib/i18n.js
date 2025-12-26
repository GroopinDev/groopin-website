import en from "../../translations/en.json";
import fr from "../../translations/fr.json";
import ar from "../../translations/ar.json";

import { LANGUAGE_STORAGE_KEY } from "./i18n-storage";

export { LANGUAGE_STORAGE_KEY };

const SUPPORTED_LOCALES = ["en", "fr", "ar"];

const translations = {
  en,
  fr,
  ar
};

export const normalizeLocale = (value) => {
  if (!value) return "en";
  const normalized = value.split("-")[0].toLowerCase();
  return SUPPORTED_LOCALES.includes(normalized) ? normalized : "en";
};

const resolvePath = (obj, path) => {
  if (!obj || !path) return undefined;
  const segments = path.split(".");
  let current = obj;
  for (const segment of segments) {
    if (current && Object.prototype.hasOwnProperty.call(current, segment)) {
      current = current[segment];
    } else {
      return undefined;
    }
  }
  return current;
};

const interpolate = (value, params = {}) => {
  if (typeof value !== "string") return value;
  return value.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      return String(params[key]);
    }
    return match;
  });
};

export const getTranslationValue = (locale, key) => {
  const table = translations[locale] || translations.en;
  let value = resolvePath(table, key);
  if (value === undefined && Object.prototype.hasOwnProperty.call(table, key)) {
    value = table[key];
  }
  if (value === undefined && locale !== "en") {
    const fallback = translations.en;
    value = resolvePath(fallback, key);
    if (value === undefined && Object.prototype.hasOwnProperty.call(fallback, key)) {
      value = fallback[key];
    }
  }
  return value;
};

export const createTranslator = (locale) => {
  const normalized = normalizeLocale(locale);
  return (key, params) => {
    const value = getTranslationValue(normalized, key);
    if (typeof value === "string") {
      return interpolate(value, params);
    }
    return key;
  };
};
