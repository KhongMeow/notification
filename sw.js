self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => self.clients.claim());

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil((async () => {
        const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        if (allClients.length) return allClients[0].focus();
        return self.clients.openWindow('/');
    })());
});