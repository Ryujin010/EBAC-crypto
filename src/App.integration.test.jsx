import { screen, fireEvent } from '@testing-library/react';
import App from './App';
import { renderWithProviders } from './utils/testUtils';
import {
  getMarkets,
  getTrending,
  getCoinDetail,
  getCoinChart,
} from './services/coinsService';
import { mockCoins, mockTrending, mockDetail } from './utils/mockData';

jest.mock('./services/coinsService');
jest.mock('./components/PriceChart', () => ({
  __esModule: true,
  default: () => null,
}));

describe('Flujos completos de la app', () => {

  // CoinDetail se carga de forma diferida: la primera importación es lenta en Jest
  
  beforeAll(async () => {
    await import('./pages/CoinDetail');
  }, 30000);

  beforeEach(() => {
    jest.resetAllMocks();
    getMarkets.mockResolvedValue(mockCoins);
    getTrending.mockResolvedValue(mockTrending);
    getCoinDetail.mockResolvedValue(mockDetail);
    getCoinChart.mockResolvedValue([{ timestamp: 1, price: 65000 }]);
  });

  it('agrega una moneda desde la lista y la ve en la Watchlist', async () => {
    renderWithProviders(<App />, { route: '/coins' });
    await screen.findByText('Bitcoin');

    fireEvent.click(screen.getByRole('button', { name: /agregar bitcoin/i }));
    expect(
      screen.getByRole('link', { name: /watchlist ★ \(1\)/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('link', { name: /watchlist/i }));

    expect(
      await screen.findByRole('heading', { name: /mi watchlist/i }),
    ).toBeInTheDocument();
    expect(await screen.findByText('Bitcoin')).toBeInTheDocument();
    expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
  });

  it('abre el detalle al pulsar una moneda del Dashboard', async () => {
    renderWithProviders(<App />, { route: '/' });

    fireEvent.click(await screen.findByRole('link', { name: /bitcoin/i }));

    expect(
      await screen.findByRole(
        'heading',
        { level: 1, name: /bitcoin/i },
        { timeout: 5000 },
      ),
    ).toBeInTheDocument();
    expect(getCoinDetail).toHaveBeenCalledWith('bitcoin', expect.any(Object));
  });
});