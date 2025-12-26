import { getToken } from "./session";
import { LANGUAGE_STORAGE_KEY } from "./i18n-storage";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const normalizeUrl = (path) => {
  if (!baseUrl && !path.startsWith("http")) {
    throw new Error("Missing NEXT_PUBLIC_API_URL for Groopin API.");
  }
  if (path.startsWith("http")) return path;
  const trimmedBase = baseUrl.replace(/\/$/, "");
  const trimmedPath = path.replace(/^\//, "");
  return `${trimmedBase}/${trimmedPath}`;
};

const getStoredLanguage = () => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    return null;
  }
};

const getLanguageHeader = () => {
  if (typeof navigator === "undefined") return "en";
  const storedLanguage = getStoredLanguage();
  return storedLanguage || navigator.language?.split("-")[0] || "en";
};

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    auth = true,
    headers: customHeaders = {}
  } = options;

  const headers = {
    Accept: "application/json",
    "Accept-Language": getLanguageHeader(),
    ...customHeaders
  };

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(normalizeUrl(path), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const error = new Error(payload?.message || "Request failed");
    error.status = response.status;
    error.data = payload;
    throw error;
  }

  return payload;
}
