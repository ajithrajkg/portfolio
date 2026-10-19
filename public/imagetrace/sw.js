const CACHE_NAME = "imagetrace-shell-v1";
const APP_URL = "/imagetrace/";
const IMAGE_TRACE_PREFIX = "/imagetrace/";
const STATIC_PREFIX = "/_next/static/";

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const response = await fetch(APP_URL, { cache: "reload" });
    if (!response.ok) {
      throw new Error(`Could not cache ImageTrace app shell (${response.status}).`);
    }
    await cache.put(APP_URL, response.clone());
    await Promise.all([
      "/imagetrace/manifest.webmanifest",
      "/imagetrace/icon.svg",
      "/logo.png",
    ].map(async (asset) => {
      const assetResponse = await fetch(asset);
      if (!assetResponse.ok) throw new Error(`Could not cache ImageTrace asset ${asset}.`);
      await cache.put(asset, assetResponse);
    }));

    const html = await response.text();
    const assets = [...html.matchAll(/(?:src|href)=["']([^"']*\/_next\/static\/[^"']+)["']/g)]
      .map(([, asset]) => new URL(asset.replaceAll("&amp;", "&"), self.location.origin).href);
    const uniqueAssets = [...new Set(assets)];
    if (!uniqueAssets.length) {
      throw new Error("ImageTrace app shell did not include any JavaScript or style assets.");
    }
    await Promise.all(uniqueAssets.map(async (asset) => {
      const assetResponse = await fetch(asset);
      if (!assetResponse.ok) throw new Error(`Could not cache ImageTrace asset ${asset}.`);
      await cache.put(asset, assetResponse);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter((name) => name.startsWith("imagetrace-shell-") && name !== CACHE_NAME)
      .map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  if (event.request.method !== "GET" || requestUrl.origin !== self.location.origin) return;

  if (event.request.mode === "navigate" && (
    requestUrl.pathname === APP_URL || requestUrl.pathname === "/imagetrace"
  )) {
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
        return new Response("ImageTrace has not been opened online yet.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
    })());
    return;
  }

  const isTraceAsset = requestUrl.pathname.startsWith(IMAGE_TRACE_PREFIX);
  const isNextStaticAsset = requestUrl.pathname.startsWith(STATIC_PREFIX);
  if (!isTraceAsset && !isNextStaticAsset) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(event.request);
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response.ok) await cache.put(event.request, response.clone());
      return response;
    } catch {
      return Response.error();
    }
  })());
});
