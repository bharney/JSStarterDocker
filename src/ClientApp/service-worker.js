workbox.skipWaiting();
workbox.clientsClaim();

workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
