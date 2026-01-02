const DEFAULT_NOTIFICATION_PATH = "/app/auth/drawer/tabs/requests";
const FRONTEND_ORIGINS = new Set([
  "https://groopin.io",
  "https://www.groopin.io"
]);

const isValidAppPath = (path) =>
  typeof path === "string" && path.startsWith("/app/");

const resolveOrigin = () => {
  if (FRONTEND_ORIGINS.has(self.location.origin)) {
    return self.location.origin;
  }
  return FRONTEND_ORIGINS.values().next().value || self.location.origin;
};

const normalizePushData = (value) => {
  if (!value) return {};
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }
  if (typeof value === "object") {
    return value;
  }
  return {};
};

const normalizeNestedData = (value) => {
  if (!value || typeof value !== "object") return value;
  if (typeof value.data === "string") {
    return { ...value, data: normalizePushData(value.data) };
  }
  return value;
};

const sanitizeUrl = (value) => {
  if (!value) return "";
  try {
    const parsed = new URL(value, self.location.origin);
    const allowedOrigins = new Set([self.location.origin, ...FRONTEND_ORIGINS]);
    if (!allowedOrigins.has(parsed.origin)) return "";
    if (!isValidAppPath(parsed.pathname)) return "";
    return parsed.href;
  } catch {
    return "";
  }
};

const getDataValue = (data, key) => {
  if (!data || typeof data !== "object") return undefined;
  if (data[key] !== undefined && data[key] !== null) {
    return data[key];
  }
  const nested = data.data;
  if (nested && typeof nested === "object") {
    if (nested[key] !== undefined && nested[key] !== null) {
      return nested[key];
    }
  }
  return undefined;
};

const parseConversationIdFromUrl = (value) => {
  if (!value || typeof value !== "string") return "";
  try {
    const parsed = new URL(value, self.location.origin);
    const match = parsed.pathname.match(/\/app\/auth\/conversations\/(\d+)/);
    return match ? match[1] : "";
  } catch {
    return "";
  }
};

const resolveActionUrl = (data) => {
  const action =
    getDataValue(data, "action") ||
    (getDataValue(data, "type") === "message" ? "message.created" : "");
  const offerId =
    getDataValue(data, "offer_id") || getDataValue(data, "offerId");
  const conversationId =
    getDataValue(data, "conversation_id") ||
    getDataValue(data, "conversationId") ||
    parseConversationIdFromUrl(getDataValue(data, "url"));

  switch (action) {
    case "offer.approved":
      return offerId ? `/app/auth/my-offers/${offerId}` : "";
    case "offer.refused":
      return "/app/auth/drawer/tabs/my-offers";
    case "offer.created":
    case "offer.draft":
    case "offer.draft.reminder":
      return offerId ? `/app/auth/my-offers/${offerId}/edit` : "";
    case "participation.request.received":
    case "participation.request.canceled":
    case "participation.request.removed":
    case "participation.request.exits":
      return offerId ? `/app/auth/my-offers/${offerId}/participants` : "/app/auth/drawer/tabs/requests";
    case "participation.request.accepted":
    case "participation.request.rejected":
      return offerId ? `/app/auth/offers/${offerId}` : "/app/auth/drawer/tabs/requests";
    case "participation.offerremoved":
      return "/app/auth/participating";
    case "participation.leavereview":
      return offerId ? `/app/auth/profile/offer-rating/${offerId}` : "";
    case "message.created":
      return conversationId ? `/app/auth/conversations/${conversationId}` : "";
    case "offer.signaled":
      return offerId ? `/app/auth/my-offers/${offerId}` : "";
    case "account.deleted":
      return "/app/guest/login";
    default:
      return offerId ? `/app/auth/my-offers/${offerId}` : "";
  }
};

const resolveNotificationUrl = (data) => {
  const targetOrigin = resolveOrigin();
  const actionUrl = resolveActionUrl(data);
  if (actionUrl && isValidAppPath(actionUrl)) {
    return new URL(actionUrl, targetOrigin).href;
  }
  const safeUrl = sanitizeUrl(data?.url);
  if (safeUrl) {
    return safeUrl;
  }
  return new URL(DEFAULT_NOTIFICATION_PATH, targetOrigin).href;
};

self.addEventListener("push", (event) => {
  let payload = {};
  if (event.data) {
    try {
      payload = event.data.json();
    } catch {
      payload = {};
    }
  }

  const data = normalizeNestedData(normalizePushData(payload.data));
  const title = payload.title || data.title || "Groopin";
  const body = payload.body || data.body || "";
  const resolvedUrl = resolveNotificationUrl(data);

  const options = {
    body,
    data: { ...data, url: resolvedUrl }
  };

  if (payload.icon) {
    options.icon = payload.icon;
  }
  if (payload.badge) {
    options.badge = payload.badge;
  }

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const safeUrl = sanitizeUrl(event.notification?.data?.url);
  const url =
    safeUrl || new URL(DEFAULT_NOTIFICATION_PATH, resolveOrigin()).href;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(
      (clientList) => {
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
        return null;
      }
    )
  );
});
