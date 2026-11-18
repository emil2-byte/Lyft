/* Lyft service worker: cache first, so the app opens at the gym with no signal.
   The log itself lives in the page's localStorage, never in the cache. */
const V = "lyft-v1.0";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(V).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== V).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      // refresh in the background when there is a connection; serve the cache either way
      const fresh = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(V).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => null);
      if (hit) return hit;
      return fresh || caches.match("./index.html");
    })
  );
});
