import { CACHE_TTL_MS } from '../utils/constants';

const store = new Map();

export const clearCache = () => store.clear();

// Devuelve el valor guardado si no ha expirado; si no, ejecuta fetcher y lo guarda.
// Si fetcher lanza un error, no se guarda nada.

export async function withCache(key, fetcher, ttl = CACHE_TTL_MS) {
  const hit = store.get(key);
  if (hit && Date.now() <= hit.expires) {
    return hit.value;
  }
  const value = await fetcher();
  store.set(key, { value, expires: Date.now() + ttl });
  return value;
}