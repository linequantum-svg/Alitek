const TTL_MS = 5 * 60 * 1000;
const PRODUCT_CACHE_VERSION = "v2";

type CacheEntry<T> = {
  expiresAt: number;
  data: T;
};

type CacheStore = {
  catalog: Map<string, CacheEntry<unknown>>;
  product: Map<string, CacheEntry<unknown>>;
};

declare global {
  // eslint-disable-next-line no-var
  var __ALITEK_STOREFRONT_CLIENT_CACHE__: CacheStore | undefined;
}

function getStore(): CacheStore {
  if (!globalThis.__ALITEK_STOREFRONT_CLIENT_CACHE__) {
    globalThis.__ALITEK_STOREFRONT_CLIENT_CACHE__ = {
      catalog: new Map(),
      product: new Map(),
    };
  }

  return globalThis.__ALITEK_STOREFRONT_CLIENT_CACHE__;
}

function readSession<T>(key: string): CacheEntry<T> | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CacheEntry<T>;
    if (!parsed?.expiresAt || parsed.expiresAt < Date.now()) {
      window.sessionStorage.removeItem(key);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function writeSession<T>(key: string, value: CacheEntry<T>) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function getCatalogCache<T>(requestKey: string): T | null {
  const store = getStore();
  const memory = store.catalog.get(requestKey) as CacheEntry<T> | undefined;

  if (memory && memory.expiresAt > Date.now()) {
    return memory.data;
  }

  const session = readSession<T>(`catalog:${requestKey}`);
  if (session) {
    store.catalog.set(requestKey, session as CacheEntry<unknown>);
    return session.data;
  }

  return null;
}

export function setCatalogCache<T>(requestKey: string, data: T) {
  const entry: CacheEntry<T> = { data, expiresAt: Date.now() + TTL_MS };
  const store = getStore();
  store.catalog.set(requestKey, entry as CacheEntry<unknown>);
  writeSession(`catalog:${requestKey}`, entry);
}

export function getProductCache<T>(slug: string): T | null {
  const store = getStore();
  const versionedKey = `${PRODUCT_CACHE_VERSION}:${slug}`;
  const memory = store.product.get(versionedKey) as CacheEntry<T> | undefined;

  if (memory && memory.expiresAt > Date.now()) {
    return memory.data;
  }

  const session = readSession<T>(`product:${versionedKey}`);
  if (session) {
    store.product.set(versionedKey, session as CacheEntry<unknown>);
    return session.data;
  }

  return null;
}

export function setProductCache<T>(slug: string, data: T) {
  const versionedKey = `${PRODUCT_CACHE_VERSION}:${slug}`;
  const entry: CacheEntry<T> = { data, expiresAt: Date.now() + TTL_MS };
  const store = getStore();
  store.product.set(versionedKey, entry as CacheEntry<unknown>);
  writeSession(`product:${versionedKey}`, entry);
}

export async function prefetchProductCache<T>(slug: string) {
  if (typeof window === "undefined") return;
  if (getProductCache<T>(slug)) return;

  try {
    const response = await fetch(`/api/products/${encodeURIComponent(slug)}`, {
      credentials: "same-origin",
    });

    if (!response.ok) return;
    const payload = (await response.json()) as T;
    setProductCache(slug, payload);
  } catch {}
}
