const CACHE_NAME = "personal-panchangam-shell-v1";
const APP_URL = "/panchangam/";
const STATIC_PREFIX = "/_next/static/";

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const response = await fetch(APP_URL, { cache: "reload" });
    if (!response.ok) throw new Error(`Could not cache Panchangam app shell (${response.status}).`);
    await cache.put(APP_URL, response.clone());
    const html = await response.text();
    const assets = [...html.matchAll(/(?:src|href)="([^"]*\/_next\/static\/[^"]+)"/g)]
      .map((match) => new URL(match[1].replaceAll("&amp;", "&"), self.location.origin).href);
    await Promise.allSettled(assets.map(async (asset) => {
      const assetResponse = await fetch(asset);
      if (assetResponse.ok) await cache.put(asset, assetResponse);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) => (
      name.startsWith("personal-panchangam-") && name !== CACHE_NAME
    )).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  if (event.request.method !== "GET" || requestUrl.origin !== self.location.origin) return;

  if (requestUrl.pathname === APP_URL || requestUrl.pathname === "/panchangam") {
    event.respondWith((async () => {
      try {
        const response = await fetch(event.request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(APP_URL, response.clone());
        }
        return response;
      } catch {
        const cached = await caches.match(APP_URL);
        if (cached) return cached;
        return new Response("Panchangam is not available offline yet.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
    })());
    return;
  }

  if (requestUrl.pathname.startsWith(STATIC_PREFIX)) {
    event.respondWith((async () => {
      try {
        const response = await fetch(event.request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(event.request, response.clone());
        }
        return response;
      } catch (error) {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        throw error;
      }
    })());
  }
});
