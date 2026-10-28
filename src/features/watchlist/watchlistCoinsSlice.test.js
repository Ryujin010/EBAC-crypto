import { fetchWatchlistCoins } from './watchlistCoinsSlice';
import { setupStore } from '../../app/store';
import { getMarkets } from '../../services/coinsService';

jest.mock('../../services/coinsService');

describe('watchlistCoinsSlice', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('no hace ninguna petición si la watchlist está vacía', async () => {
    const store = setupStore();

    await store.dispatch(fetchWatchlistCoins());

    expect(getMarkets).not.toHaveBeenCalled();
    expect(store.getState().watchlistCoins.items).toEqual([]);
    expect(store.getState().watchlistCoins.status).toBe('succeeded');
  });

  it('pide los datos de las monedas guardadas', async () => {
    getMarkets.mockResolvedValue([{ id: 'bitcoin' }, { id: 'solana' }]);
    const store = setupStore({
      watchlist: { ids: ['bitcoin', 'solana'] },
    });

    await store.dispatch(fetchWatchlistCoins());

    expect(getMarkets).toHaveBeenCalledWith(
      expect.objectContaining({ ids: ['bitcoin', 'solana'], perPage: 2 }),
    );
    expect(store.getState().watchlistCoins.items).toHaveLength(2);
  });

  it('guarda el error si la petición falla', async () => {
    getMarkets.mockRejectedValue({ request: {} });
    const store = setupStore({ watchlist: { ids: ['bitcoin'] } });

    await store.dispatch(fetchWatchlistCoins());

    expect(store.getState().watchlistCoins.status).toBe('failed');
    expect(store.getState().watchlistCoins.error).toMatch(/no hay conexión/i);
  });
});