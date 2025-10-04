// sw.js
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Trading Signal';
  const options = {
    body: data.body || 'New trading signal detected!',
    icon: '/icon.png', // Optional: Add an icon file
    badge: '/badge.png', // Optional: Add a badge file
    data: { url: data.url || window.location.href }, // URL to open on click
    vibrate: [200, 100, 200], // Vibration pattern for mobile
    requireInteraction: true // Keep notification until user interacts
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});