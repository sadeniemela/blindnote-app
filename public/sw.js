// Blindnote service worker. The browser runs this in the background, even when no
// Blindnote tab is open, so it can show a notification when the server sends a push.

self.addEventListener("push", (event) => {
  if (!event.data) return
  const data = event.data.json()

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/pwa-icon/192",
      badge: "/pwa-icon/96",
      // Notifications with the same tag replace each other instead of piling up
      tag: data.tag,
      data: { url: data.url || "/dashboard/forms" },
    })
  )
})

// Tapping the notification opens the form's results, or focuses an open Blindnote window
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const url = new URL(event.notification.data.url, self.location.origin).href

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      for (const client of windows) {
        if ("focus" in client && "navigate" in client) {
          return client.navigate(url).then((c) => (c || client).focus())
        }
      }
      return self.clients.openWindow(url)
    })
  )
})
