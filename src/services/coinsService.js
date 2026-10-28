import api from './api';
import { withCache } from './cache';

// Lista de monedas con precio, market cap y variación 24h

export const getMarkets = ({
  vsCurrency = 'usd',
  order = 'market_cap_desc',
  perPage = 20,
  page = 1,
  ids,
  signal,
} = {}) => {
  const params = {
    vs_currency: vsCurrency,
    order,
    per_page: perPage,
    page,
    sparkline: false,
  };
  if (ids?.length) params.ids = ids.join(',');

  return withCache(`markets:${JSON.stringify(params)}`, async () => {
    const { data } = await api.get('/coins/markets', { params, signal });
    return data;
  });
};

// Busca por texto y devuelve los ids encontrados

export const searchCoins = (query, { signal } = {}) =>
  withCache(`search:${query.toLowerCase()}`, async () => {
    const { data } = await api.get('/search', { params: { query }, signal });
    return data.coins.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      rank: coin.market_cap_rank,
      thumb: coin.thumb,
    }));
  });

// Monedas en tendencia

export const getTrending = ({ signal } = {}) =>
  withCache('trending', async () => {
    const { data } = await api.get('/search/trending', { signal });
    return data.coins.map(({ item }) => ({
      id: item.id,
      name: item.name,
      symbol: item.symbol,
      rank: item.market_cap_rank,
      thumb: item.thumb,
    }));
  });

// Detalle de una moneda. Los valores de mercado llegan como mapas por moneda
// (por ejemplo currentPrice.usd) y la interfaz elige cuál mostrar.

export const getCoinDetail = (id, { signal } = {}) => {
  const params = {
    localization: false,
    tickers: false,
    market_data: true,
    community_data: false,
    developer_data: false,
    sparkline: false,
  };

  return withCache(`detail:${id}`, async () => {
    const { data } = await api.get(`/coins/${id}`, { params, signal });
    const md = data.market_data ?? {};
    return {
      id: data.id,
      name: data.name,
      symbol: data.symbol,
      image: data.image?.large ?? '',
      description: data.description?.en ?? '',
      rank: data.market_cap_rank ?? null,
      homepage: data.links?.homepage?.[0] ?? '',
      categories: data.categories ?? [],
      marketData: {
        currentPrice: md.current_price ?? {},
        marketCap: md.market_cap ?? {},
        totalVolume: md.total_volume ?? {},
        high24h: md.high_24h ?? {},
        low24h: md.low_24h ?? {},
        ath: md.ath ?? {},
        priceChange24h: md.price_change_percentage_24h ?? null,
        circulatingSupply: md.circulating_supply ?? null,
        totalSupply: md.total_supply ?? null,
      },
    };
  });
};

// Historial de precios para la gráfica

export const getCoinChart = (
  id,
  { vsCurrency = 'usd', days = 7, signal } = {},
) => {
  const params = { vs_currency: vsCurrency, days };

  return withCache(`chart:${id}:${JSON.stringify(params)}`, async () => {
    const { data } = await api.get(`/coins/${id}/market_chart`, {
      params,
      signal,
    });
    return data.prices.map(([timestamp, price]) => ({ timestamp, price }));
  });
};