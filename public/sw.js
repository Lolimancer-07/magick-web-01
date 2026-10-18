const CACHE_NAME = "magick-studio-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/app/",
  "/manifest.json",
  "/wasm/magick.wasm",
  "/magick.worker.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn("[SW] Cache addAll skipped missing items:", err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Handle Share Target POST: store uploaded files in Cache/IndexedDB and redirect to /app
  if (event.request.method === "POST" && url.pathname.startsWith("/app")) {
    event.respondWith(
      (async () => {
        try {
          const formData = await event.request.formData();
          const files = formData.getAll("images");
          // Store shared files in cache
          if (files && files.length > 0) {
            const cache = await caches.open("magick-shared-files");
            for (let i = 0; i < files.length; i++) {
              const file = files[i];
              if (file instanceof File) {
                const response = new Response(file, {
                  headers: {
                    "Content-Type": file.type || "application/octet-stream",
                    "X-File-Name": encodeURIComponent(file.name)
                  }
                });
                await cache.put(`/shared-file-${i}`, response);
              }
            }
          }
        } catch (e) {
          console.error("[SW] Share Target parsing error:", e);
        }
        return Response.redirect("/app/?shared=true", 303);
      })()
    );
    return;
  }

  // Cache-first for wasm and worker assets
  if (url.pathname.includes("/wasm/") || url.pathname.includes("magick.worker.js")) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((networkRes) => {
          if (networkRes.ok) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          }
          return networkRes;
        });
      })
    );
    return;
  }

  // Network-first with cache fallback for everything else
  event.respondWith(
    fetch(event.request)
      .then((networkRes) => {
        if (networkRes.ok && event.request.method === "GET") {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        }
        return networkRes;
      })
      .catch(() => caches.match(event.request))
  );
});
