const CACHE_NAME = "bakers-mate-UItest-v0.0.3";

const FILES_TO_CACHE = [

  "./",
  "./index.html",
  "./style.css",
  "./manifest.json",

  "./js/app.js",
  "./js/ui.js",
  "./js/calculator.js",
  "./js/presets.js",
  "./js/storage.js",
  "./js/wake-lock.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      );
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    }),
  );
});
