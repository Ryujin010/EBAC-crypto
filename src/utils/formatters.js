const FALLBACK = '—';
const isMissing = (value) => value === null || value === undefined;

// Precio con símbolo de moneda; las monedas baratas muestran más decimales

export const formatCurrency = (value, currency = 'usd') => {
  if (isMissing(value)) return FALLBACK;
  const maxDigits = value >= 1 ? 2 : value >= 0.01 ? 4 : 8;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: maxDigits,
  }).format(value);
};

// Cantidades grandes: $1.3T, $25.4B...

export const formatCompact = (value, currency = 'usd') => {
  if (isMissing(value)) return FALLBACK;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
};

// Número compacto sin moneda (por ejemplo, el suministro)

export const formatNumber = (value) => {
  if (isMissing(value)) return FALLBACK;
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatPercent = (value) => {
  if (isMissing(value)) return FALLBACK;
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
};

// Clase CSS según el signo del cambio

export const changeClass = (value) => {
  if (isMissing(value) || value === 0) return 'muted';
  return value > 0 ? 'up' : 'down';
};

// Quita las etiquetas HTML de un texto (se muestra siempre como texto plano)

export const stripHtml = (html = '') => html.replace(/<[^>]*>/g, '').trim();