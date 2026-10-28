import api from './api';
import { clearCache } from './cache';
import {
  getMarkets,
  searchCoins,
  getTrending,
  getCoinDetail,
  getCoinChart,
} from './coinsService';

jest.mock('./api', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

describe('coinsService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    clearCache();
  });

  describe('getMarkets', () => {
    it('envía los parámetros correctos', async () => {
      api.get.mockResolvedValue({ data: [{ id: 'bitcoin' }] });

      const result = await getMarkets({
        vsCurrency: 'mxn',
        page: 2,
        perPage: 10,
      });

      expect(result).toEqual([{ id: 'bitcoin' }]);
      expect(api.get).toHaveBeenCalledWith(
        '/coins/markets',
        expect.objectContaining({
          params: expect.objectContaining({
            vs_currency: 'mxn',
            page: 2,
            per_page: 10,
          }),
        }),
      );
    });

    it('une los ids con comas', async () => {
      api.get.mockResolvedValue({ data: [] });

      await getMarkets({ ids: ['bitcoin', 'ethereum'] });

      expect(api.get).toHaveBeenCalledWith(
        '/coins/markets',
        expect.objectContaining({
          params: expect.objectContaining({ ids: 'bitcoin,ethereum' }),
        }),
      );
    });

    it('usa la caché para la misma consulta', async () => {
      api.get.mockResolvedValue({ data: [{ id: 'bitcoin' }] });

      await getMarkets({ page: 1 });
      await getMarkets({ page: 1 });
      expect(api.get).toHaveBeenCalledTimes(1);

      await getMarkets({ page: 2 });
      expect(api.get).toHaveBeenCalledTimes(2);
    });
  });

  it('searchCoins devuelve solo los campos necesarios', async () => {
    api.get.mockResolvedValue({
      data: {
        coins: [
          {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'BTC',
            market_cap_rank: 1,
            thumb: 'btc.png',
            otro: 'se descarta',
          },
        ],
      },
    });

    expect(await searchCoins('bit')).toEqual([
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', rank: 1, thumb: 'btc.png' },
    ]);
  });

  it('getTrending aplana la respuesta de la API', async () => {
    api.get.mockResolvedValue({
      data: {
        coins: [
          {
            item: {
              id: 'pepe',
              name: 'Pepe',
              symbol: 'PEPE',
              market_cap_rank: 30,
              thumb: 'pepe.png',
            },
          },
        ],
      },
    });

    expect(await getTrending()).toEqual([
      { id: 'pepe', name: 'Pepe', symbol: 'PEPE', rank: 30, thumb: 'pepe.png' },
    ]);
  });

  it('getCoinDetail normaliza el detalle de la moneda', async () => {
    api.get.mockResolvedValue({
      data: {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'btc',
        image: { large: 'img.png' },
        description: { en: 'Descripción' },
        market_cap_rank: 1,
        links: { homepage: ['https://bitcoin.org', ''] },
        categories: ['Currency'],
        market_data: {
          current_price: { usd: 1 },
          market_cap: { usd: 2 },
          total_volume: { usd: 3 },
          high_24h: { usd: 4 },
          low_24h: { usd: 0.5 },
          ath: { usd: 5 },
          price_change_percentage_24h: 2.5,
          circulating_supply: 19,
          total_supply: 21,
        },
      },
    });

    expect(await getCoinDetail('bitcoin')).toEqual({
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'btc',
      image: 'img.png',
      description: 'Descripción',
      rank: 1,
      homepage: 'https://bitcoin.org',
      categories: ['Currency'],
      marketData: {
        currentPrice: { usd: 1 },
        marketCap: { usd: 2 },
        totalVolume: { usd: 3 },
        high24h: { usd: 4 },
        low24h: { usd: 0.5 },
        ath: { usd: 5 },
        priceChange24h: 2.5,
        circulatingSupply: 19,
        totalSupply: 21,
      },
    });
  });

  it('getCoinChart convierte los pares [fecha, precio] en objetos', async () => {
    api.get.mockResolvedValue({
      data: {
        prices: [
          [1700000000000, 35000],
          [1700003600000, 35100],
        ],
      },
    });

    const result = await getCoinChart('bitcoin', { vsCurrency: 'usd', days: 7 });

    expect(result).toEqual([
      { timestamp: 1700000000000, price: 35000 },
      { timestamp: 1700003600000, price: 35100 },
    ]);
    expect(api.get).toHaveBeenCalledWith(
      '/coins/bitcoin/market_chart',
      expect.objectContaining({ params: { vs_currency: 'usd', days: 7 } }),
    );
  });
});