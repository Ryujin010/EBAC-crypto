import reducer, {
  setPage,
  setQuery,
  setVsCurrency,
  setSortBy,
  resetFilters,
  fetchCoins,
  fetchTrending,
} from './coinsSlice';
import { setupStore } from '../../app/store';
import {
  getMarkets,
  searchCoins,
  getTrending,
} from '../../services/coinsService';

jest.mock('../../services/coinsService');

describe('coinsSlice', () => {
  it('tiene el estado inicial esperado', () => {
    const state = reducer(undefined, { type: 'desconocida' });
    expect(state).toMatchObject({
      items: [],
      status: 'idle',
      error: null,
      page: 1,
      query: '',
      vsCurrency: 'usd',
      sortBy: 'market_cap_desc',
    });
    expect(state.trending).toEqual({ items: [], status: 'idle', error: null });
  });

  it('cambia de página', () => {
    const state = reducer(undefined, setPage(3));
    expect(state.page).toBe(3);
  });

  it('al buscar, guarda el texto y vuelve a la página 1', () => {
    const state = reducer({ ...reducer(undefined, setPage(4)) }, setQuery('btc'));
    expect(state.query).toBe('btc');
    expect(state.page).toBe(1);
  });

  it('al cambiar moneda u orden, vuelve a la página 1', () => {
    let state = reducer(undefined, setPage(5));
    state = reducer(state, setVsCurrency('mxn'));
    expect(state.vsCurrency).toBe('mxn');
    expect(state.page).toBe(1);

    state = reducer(reducer(state, setPage(2)), setSortBy('volume_desc'));
    expect(state.sortBy).toBe('volume_desc');
    expect(state.page).toBe(1);
  });

  it('restablece los filtros', () => {
    let state = reducer(undefined, setQuery('eth'));
    state = reducer(state, setVsCurrency('eur'));
    state = reducer(state, resetFilters());
    expect(state).toMatchObject({
      query: '',
      vsCurrency: 'usd',
      sortBy: 'market_cap_desc',
      page: 1,
    });
  });
});

describe('coinsSlice: fetchCoins', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('guarda las monedas cuando la petición tiene éxito', async () => {
    getMarkets.mockResolvedValue([{ id: 'bitcoin' }, { id: 'ethereum' }]);
    const store = setupStore();

    await store.dispatch(fetchCoins());

    const { coins } = store.getState();
    expect(coins.status).toBe('succeeded');
    expect(coins.items).toEqual([{ id: 'bitcoin' }, { id: 'ethereum' }]);
    expect(getMarkets).toHaveBeenCalledWith(
      expect.objectContaining({
        vsCurrency: 'usd',
        order: 'market_cap_desc',
        perPage: 20,
        page: 1,
      }),
    );
  });

  it('guarda un mensaje claro cuando la API responde 429', async () => {
    getMarkets.mockRejectedValue({ response: { status: 429 } });
    const store = setupStore();

    await store.dispatch(fetchCoins());

    const { coins } = store.getState();
    expect(coins.status).toBe('failed');
    expect(coins.error).toMatch(/demasiadas solicitudes/i);
  });

  it('con texto de búsqueda, consulta primero los ids y luego los precios', async () => {
    searchCoins.mockResolvedValue([{ id: 'bitcoin' }, { id: 'bitcoin-cash' }]);
    getMarkets.mockResolvedValue([{ id: 'bitcoin' }, { id: 'bitcoin-cash' }]);
    const store = setupStore();

    store.dispatch(setQuery('bit'));
    await store.dispatch(fetchCoins());

    expect(searchCoins).toHaveBeenCalledWith('bit', expect.any(Object));
    expect(getMarkets).toHaveBeenCalledWith(
      expect.objectContaining({ ids: ['bitcoin', 'bitcoin-cash'] }),
    );
    expect(store.getState().coins.items).toHaveLength(2);
  });

  it('si la búsqueda no encuentra nada, devuelve una lista vacía sin pedir precios', async () => {
    searchCoins.mockResolvedValue([]);
    const store = setupStore();

    store.dispatch(setQuery('zzzz'));
    await store.dispatch(fetchCoins());

    expect(getMarkets).not.toHaveBeenCalled();
    expect(store.getState().coins.items).toEqual([]);
    expect(store.getState().coins.status).toBe('succeeded');
  });

  it('una petición cancelada no se marca como error', async () => {
    getMarkets.mockReturnValue(new Promise(() => {}));
    const store = setupStore();

    const request = store.dispatch(fetchCoins());
    request.abort();
    await request;

    expect(store.getState().coins.status).toBe('loading');
    expect(store.getState().coins.error).toBeNull();
  });
});

describe('coinsSlice: fetchTrending', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('guarda las monedas en tendencia', async () => {
    getTrending.mockResolvedValue([{ id: 'pepe' }]);
    const store = setupStore();

    await store.dispatch(fetchTrending());

    expect(store.getState().coins.trending).toEqual({
      items: [{ id: 'pepe' }],
      status: 'succeeded',
      error: null,
    });
  });

  it('guarda el error si falla', async () => {
    getTrending.mockRejectedValue({ response: { status: 500 } });
    const store = setupStore();

    await store.dispatch(fetchTrending());

    expect(store.getState().coins.trending.status).toBe('failed');
    expect(store.getState().coins.trending.error).toMatch(/no está disponible/i);
  });
});