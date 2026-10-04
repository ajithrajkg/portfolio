const CACHE_NAME = "notepad-pwa-v1";
const APP_PATH = "/notepad/";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith("notepad-pwa-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_NOTEPAD") return;

  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const pageResponse = await fetch(APP_PATH);
    if (!pageResponse.ok) return;
    const pageHtml = await pageResponse.clone().text();
    await cache.put(APP_PATH, pageResponse);

    const appAssets = [...pageHtml.matchAll(/(?:src|href)=["']([^"']*\/_next\/static\/[^"']+)["']/g)]
      .map(([, asset]) => new URL(asset, self.location.origin).href);
    await Promise.allSettled([
      cache.add(`${APP_PATH}manifest.webmanifest`),
      cache.add(`${APP_PATH}icon.svg`),
      ...new Set(appAssets).map((asset) => cache.add(asset)),
    ]);
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  const isNotepadPage =
    request.mode === "navigate" && url.pathname.startsWith(APP_PATH);
  const isNotepadAsset =
    url.pathname.startsWith("/_next/static/") || url.pathname.startsWith(APP_PATH);
  if (!isNotepadPage && !isNotepadAsset) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseCopy));
        }
        return response;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;
        if (isNotepadPage) return caches.match(APP_PATH);
        return Response.error();
      }),
  );
});