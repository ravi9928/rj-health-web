const CACHE_NAME = "rj-healthcare-v1"
const urlsToCache = [
  "/",
  "/doctors",
  "/procedures",
  "/slots",
  "/bookings",
  "/coupons",
  "/refunds",
  "/patients",
  "/settings",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }
      return fetch(event.request)
    }),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// Handle push notifications
self.addEventListener("push", (event) => {
  console.log("Push event received:", event)

  let notificationData = {}

  if (event.data) {
    try {
      notificationData = event.data.json()
    } catch (e) {
      notificationData = {
        title: "RJ Healthcare",
        body: event.data.text() || "You have a new notification",
      }
    }
  }

  const options = {
    body: notificationData.body || "You have a new notification",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    data: notificationData.data || {},
    requireInteraction: true,
    actions: [
      {
        action: "view",
        title: "View",
      },
      {
        action: "dismiss",
        title: "Dismiss",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification(notificationData.title || "RJ Healthcare", options))
})

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("Notification click received:", event)

  event.notification.close()

  if (event.action === "view") {
    // Open the app
    event.waitUntil(clients.openWindow("/"))
  } else if (event.action === "dismiss") {
    // Just close the notification
    return
  } else {
    // Default action - open the app
    event.waitUntil(clients.openWindow("/"))
  }
})

// Handle background sync
self.addEventListener("sync", (event) => {
  console.log("Background sync event:", event.tag)

  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync())
  }
})

function doBackgroundSync() {
  // Perform background sync operations
  console.log("Performing background sync...")
  return Promise.resolve()
}
