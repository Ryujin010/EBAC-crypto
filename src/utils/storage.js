const WATCHLIST_KEY = 'crypto-tracker:watchlist';

export const loadWatchlist = () => {
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveWatchlist = (ids) => {
  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(ids));
  } catch {
    // Si el almacenamiento no está disponible (modo privado, cuota llena), se ignora.
  }
};