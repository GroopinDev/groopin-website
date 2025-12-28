import { getToken } from "./session";
import { LANGUAGE_STORAGE_KEY } from "./i18n-storage";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_CACHE_TIME = 15000;
const responseCache = new Map();
const inflightRequests = new Map();

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

const getCacheKey = (method, url, headers) => {
  const language = headers["Accept-Language"] || headers["accept-language"] || "";
  const authHeader = headers.Authorization || "";
  return `${method}:${url}:lang=${language}:auth=${authHeader}`;
};

const getCachedResponse = (key) => {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    responseCache.delete(key);
    return null;
  }
  return entry.data;
};

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    auth = true,
    headers: customHeaders = {},
    cache,
    cacheTime = DEFAULT_CACHE_TIME,
    dedupe,
    invalidate
  } = options;

  const requestMethod = method.toUpperCase();
  const shouldCache = cache ?? requestMethod === "GET";
  const shouldDedupe = dedupe ?? requestMethod === "GET";
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

  const url = normalizeUrl(path);
  const cacheKey =
    requestMethod === "GET" ? getCacheKey(requestMethod, url, headers) : null;

  if (shouldCache && cacheKey) {
    const cachedResponse = getCachedResponse(cacheKey);
    if (cachedResponse !== null) {
      return cachedResponse;
    }
  }

  if (shouldDedupe && cacheKey && inflightRequests.has(cacheKey)) {
    return inflightRequests.get(cacheKey);
  }

  const requestPromise = fetch(url, {
    method: requestMethod,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })
    .then(async (response) => {
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

      if (shouldCache && cacheKey && cacheTime > 0) {
        responseCache.set(cacheKey, {
          data: payload,
          expiresAt: Date.now() + cacheTime
        });
      }

      if (requestMethod !== "GET" && invalidate !== false) {
        responseCache.clear();
      }

      return payload;
    })
    .finally(() => {
      if (cacheKey) {
        inflightRequests.delete(cacheKey);
      }
    });

  if (shouldDedupe && cacheKey) {
    inflightRequests.set(cacheKey, requestPromise);
  }

  return requestPromise;
}
