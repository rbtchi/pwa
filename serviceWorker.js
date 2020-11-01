// Precache static resources here.
const precache = 'precache-v1';

// Update cache names any time any of the cached files change.
const filesToCache = [
    './offlinePage.html',
];

// 當service worker在「安裝階段」時會觸發此事件
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing Service Worker ...', event);
    //Pre-caching offline page
    event.waitUntil(
        caches.open(precache).then((cache) => {
            return cache.addAll(filesToCache);
        })
    );
});

// 當service worker在「激活階段」時會觸發此事件
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating Service Worker ...', event);
    // Remove previous cached data from disk.
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== precache) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});

// 監聽fetch 事件
self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Fetch Service Worker ...', event);
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.open(precache).then((cache) => {
                return cache.match(filesToCache);
            });
        })
    );
});