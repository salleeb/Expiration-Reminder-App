self.addEventListener('push', function(event) {
    const data = event.data.json();

    const options = {
        body: data.body,
        icon: '/path/to/icon.png',
        badge: '/path/to/badge.png',
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        // eslint-disable-next-line no-undef
        clients.openWindow('/')
    );
});




// manifest.json?
// {
//     "short_name": "React App",
//     "name": "Create React App Sample",
//     "icons": [
//       {
//         "src": "favicon.ico",
//         "sizes": "64x64 32x32 24x24 16x16",
//         "type": "image/x-icon"
//       },
//       {
//         "src": "logo192.png",
//         "type": "image/png",
//         "sizes": "192x192"
//       },
//       {
//         "src": "logo512.png",
//         "type": "image/png",
//         "sizes": "512x512"
//       }
//     ],
//     "start_url": ".",
//     "display": "standalone",
//     "theme_color": "#000000",
//     "background_color": "#ffffff"
// }
  