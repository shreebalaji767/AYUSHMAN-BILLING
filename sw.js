/* BLSSNVJ21 static GitHub Pages service worker */
const CACHE_NAME = "blssnvj21-ayushman-billing-v2026.11.15";
const BASE_URL = new URL("./", self.registration.scope);
const APP_SHELL = [
  "", "static/css/style.css?v=2026.11.15", "static/css/print.css?v=2026.11.15",
  "static/js/app.js?v=2026.11.15", "static/manifest.webmanifest",
  "static/icons/icon-192.svg", "static/icons/icon-512.svg", "static/icons/favicon.svg"
].map((path) => new URL(path, BASE_URL).toString());
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key.startsWith("blssnvj21-ayushman-billing-") && key !== CACHE_NAME).map((key) => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener("message", (event) => { if (event.data?.type === "SKIP_WAITING") self.skipWaiting(); });
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    event.respondWith((async () => {
      const home = new URL("", BASE_URL).toString();
      try {
        const response = await fetch(request);
        if (response.ok) await (await caches.open(CACHE_NAME)).put(home, response.clone());
        return response;
      } catch (_) {
        return (await caches.match(home)) || new Response("Offline — connect once to cache the app shell.", {status:503,headers:{"Content-Type":"text/plain; charset=utf-8"}});
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok) await (await caches.open(CACHE_NAME)).put(request, response.clone());
      return response;
    } catch (_) {
      return new Response("Offline", {status:503,headers:{"Content-Type":"text/plain; charset=utf-8"}});
    }
  })());
});
