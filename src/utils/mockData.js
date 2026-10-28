// Datos de ejemplo para las pruebas
export const mockCoins = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'btc',
    image: 'btc.png',
    current_price: 65000.5,
    market_cap: 1300000000000,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.5,
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'eth',
    image: 'eth.png',
    current_price: 3200,
    market_cap: 380000000000,
    market_cap_rank: 2,
    price_change_percentage_24h: -1.2,
  },
];

export const mockTrending = [
  { id: 'pepe', name: 'Pepe', symbol: 'PEPE', rank: 30, thumb: 'pepe.png' },
];

export const mockDetail = {
  id: 'bitcoin',
  name: 'Bitcoin',
  symbol: 'btc',
  image: 'btc.png',
  description:
    '<a href="https://bitcoin.org">Bitcoin</a> es una moneda digital.',
  rank: 1,
  homepage: 'https://bitcoin.org',
  categories: ['Currency'],
  marketData: {
    currentPrice: { usd: 65000, mxn: 1200000, eur: 60000 },
    marketCap: { usd: 1300000000000 },
    totalVolume: { usd: 30000000000 },
    high24h: { usd: 66000 },
    low24h: { usd: 64000 },
    ath: { usd: 73000 },
    priceChange24h: 2.5,
    circulatingSupply: 19700000,
    totalSupply: 21000000,
  },
};