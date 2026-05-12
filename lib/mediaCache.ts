const CACHE_NAME = "menufy-media-v1";

export async function getCachedResponse(url: string): Promise<Response | null> {
  if (typeof window === "undefined" || !("caches" in window)) return null;
  try {
    const cache = await caches.open(CACHE_NAME);
    const match = await cache.match(url);
    if (match) {
      console.info(`[MediaCache] FRONTEND CACHE HIT ${url}`);
    }
    return match || null;
  } catch (err) {
    console.warn("mediaCache.getCachedResponse error", err);
    return null;
  }
}

export async function putCachedResponse(url: string, response: Response) {
  if (typeof window === "undefined" || !("caches" in window)) return;
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(url, response.clone());
    console.info(`[MediaCache] FRONTEND CACHE STORE ${url}`);
  } catch (err) {
    console.warn("mediaCache.putCachedResponse error", err);
  }
}

export async function fetchViaProxy(
  apiBase: string,
  url: string,
): Promise<Response> {
  const proxyUrl = `${apiBase}/media/proxy?url=${encodeURIComponent(url)}`;
  return fetch(proxyUrl);
}
