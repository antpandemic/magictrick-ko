// sw.js — put this file in the SAME folder as your HTML file (same level
// as LAB_LITIR2.html), on GitHub Pages. It only handles push notifications
// for the "Miss you" button — it does not cache or intercept anything else.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (err) {
    data = { title: 'Miss you 💛', body: event.data ? event.data.text() : '' };
  }

  const title = data.title || 'Miss you 💛';
  const options = {
    body: data.body || '',
    tag: 'miss-you-ping',   // replaces any earlier miss-you notification instead of stacking
    renotify: true,          // ...but still buzzes/sounds again each time
    vibrate: [200, 100, 200, 100, 200],
    icon: data.icon || undefined,
    badge: data.badge || undefined,
    data: { url: data.url || './' }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});
