import reducer, {
  fetchCoinDetail,
  fetchCoinChart,
  clearCoinDetail,
} from './coinDetailSlice';
import { setupStore } from '../../app/store';
import { getCoinDetail, getCoinChart } from '../../services/coinsService';

jest.mock('../../services/coinsService');

describe('coinDetailSlice', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('tiene un estado inicial vacío', () => {
    const state = reducer(undefined, { type: 'desconocida' });
    expect(state.data).toBeNull();
    expect(state.status).toBe('idle');
    expect(state.chart.prices).toEqual([]);
  });

  it('guarda el detalle de la moneda', async () => {
    getCoinDetail.mockResolvedValue({ id: 'bitcoin', name: 'Bitcoin' });
    const store = setupStore();

    await store.dispatch(fetchCoinDetail('bitcoin'));

    const { coinDetail } = store.getState();
    expect(coinDetail.status).toBe('succeeded');
    expect(coinDetail.data).toEqual({ id: 'bitcoin', name: 'Bitcoin' });
    expect(getCoinDetail).toHaveBeenCalledWith('bitcoin', expect.any(Object));
  });

  it('guarda el error si la moneda no existe', async () => {
    getCoinDetail.mockRejectedValue({ response: { status: 404 } });
    const store = setupStore();

    await store.dispatch(fetchCoinDetail('no-existe'));

    const { coinDetail } = store.getState();
    expect(coinDetail.status).toBe('failed');
    expect(coinDetail.error).toMatch(/no se encontró/i);
  });

  it('al pedir otra moneda, limpia los datos de la anterior', async () => {
    getCoinDetail.mockResolvedValueOnce({ id: 'bitcoin', name: 'Bitcoin' });
    const store = setupStore();
    await store.dispatch(fetchCoinDetail('bitcoin'));

    getCoinDetail.mockReturnValueOnce(new Promise(() => {}));
    store.dispatch(fetchCoinDetail('ethereum'));

    expect(store.getState().coinDetail.data).toBeNull();
    expect(store.getState().coinDetail.status).toBe('loading');
  });

  it('guarda los precios de la gráfica', async () => {
    getCoinChart.mockResolvedValue([{ timestamp: 1, price: 100 }]);
    const store = setupStore();

    await store.dispatch(
      fetchCoinChart({ id: 'bitcoin', vsCurrency: 'usd', days: 7 }),
    );

    const { chart } = store.getState().coinDetail;
    expect(chart.status).toBe('succeeded');
    expect(chart.coinId).toBe('bitcoin');
    expect(chart.prices).toEqual([{ timestamp: 1, price: 100 }]);
  });

  it('guarda el error de la gráfica si la petición falla', async () => {
    getCoinChart.mockRejectedValue({ code: 'ECONNABORTED' });
    const store = setupStore();

    await store.dispatch(
      fetchCoinChart({ id: 'bitcoin', vsCurrency: 'usd', days: 7 }),
    );

    expect(store.getState().coinDetail.chart.status).toBe('failed');
    expect(store.getState().coinDetail.chart.error).toMatch(/tardó demasiado/i);
  });

  it('clearCoinDetail devuelve el estado inicial', async () => {
    getCoinDetail.mockResolvedValue({ id: 'bitcoin' });
    const store = setupStore();
    await store.dispatch(fetchCoinDetail('bitcoin'));

    store.dispatch(clearCoinDetail());

    expect(store.getState().coinDetail.data).toBeNull();
    expect(store.getState().coinDetail.status).toBe('idle');
  });
});