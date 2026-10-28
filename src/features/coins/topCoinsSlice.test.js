import { fetchTopCoins } from './topCoinsSlice';
import { setupStore } from '../../app/store';
import { getMarkets } from '../../services/coinsService';

jest.mock('../../services/coinsService');

describe('topCoinsSlice', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('guarda las 5 monedas principales', async () => {
    getMarkets.mockResolvedValue([{ id: 'bitcoin' }]);
    const store = setupStore();

    await store.dispatch(fetchTopCoins());

    expect(store.getState().topCoins).toEqual({
      items: [{ id: 'bitcoin' }],
      status: 'succeeded',
      error: null,
    });
    expect(getMarkets).toHaveBeenCalledWith(
      expect.objectContaining({ perPage: 5, page: 1, vsCurrency: 'usd' }),
    );
  });

  it('guarda el error si la petición falla', async () => {
    getMarkets.mockRejectedValue({ response: { status: 429 } });
    const store = setupStore();

    await store.dispatch(fetchTopCoins());

    expect(store.getState().topCoins.status).toBe('failed');
    expect(store.getState().topCoins.error).toMatch(/demasiadas solicitudes/i);
  });
});