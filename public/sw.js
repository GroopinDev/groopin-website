self.addEventListener("push", (event) => {
  let payload = {};
  if (event.data) {
    try {
      payload = event.data.json();
    } catch {
      payload = {};
    }
  }

  const data = payload.data || {};
  const title = payload.title || data.title || "Groopin";
  const body = payload.body || data.body || "";
  const url = data.url || "/app/auth/drawer/notifications";
  const resolvedUrl = new URL(url, self.location.origin).href;

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
  const url =
    event.notification?.data?.url ||
    new URL("/app/auth/drawer/notifications", self.location.origin).href;

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
