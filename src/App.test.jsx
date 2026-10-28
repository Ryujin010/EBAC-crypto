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

// La gráfica usa recharts, que no hace falta cargar en estas pruebas

jest.mock('./components/PriceChart', () => ({
  __esModule: true,
  default: () => null,
}));

describe('App', () => {

  // CoinDetail se carga de forma diferida (React.lazy). La primera importación
  // es lenta en Jest, así que la hacemos una vez antes de las pruebas.
  
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

  it('muestra el Dashboard con el top 5 y las monedas en tendencia', async () => {
    renderWithProviders(<App />, { route: '/' });

    expect(
      screen.getByRole('heading', { name: /mercado cripto/i }),
    ).toBeInTheDocument();
    expect(await screen.findByText('Bitcoin')).toBeInTheDocument();
    expect(await screen.findByText('Pepe')).toBeInTheDocument();
  });

  it('muestra la página 404 en una ruta inexistente', () => {
    renderWithProviders(<App />, { route: '/ruta-que-no-existe' });
    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument();
  });

  it('muestra el detalle de la moneda según el id de la URL', async () => {
    renderWithProviders(<App />, { route: '/coins/bitcoin' });

    // level: 1 distingue el título principal del "Acerca de Bitcoin" (h2)
    
    expect(
      await screen.findByRole(
        'heading',
        { level: 1, name: /bitcoin/i },
        { timeout: 5000 },
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('$65,000.00')).toBeInTheDocument();
    expect(getCoinDetail).toHaveBeenCalledWith('bitcoin', expect.any(Object));
  });

  it('muestra en el Navbar cuántas monedas hay en la watchlist', async () => {
    renderWithProviders(<App />, {
      route: '/watchlist',
      preloadedState: { watchlist: { ids: ['bitcoin', 'ethereum'] } },
    });

    expect(
      screen.getByRole('link', { name: /watchlist ★ \(2\)/i }),
    ).toBeInTheDocument();
    expect(await screen.findByText('Bitcoin')).toBeInTheDocument();
  });

  it('navega del Dashboard a la lista de monedas', async () => {
    renderWithProviders(<App />, { route: '/' });
    await screen.findByText('Pepe');

    fireEvent.click(screen.getByRole('link', { name: 'Coins' }));

    expect(
      await screen.findByRole('heading', { name: 'Monedas' }),
    ).toBeInTheDocument();
    expect(await screen.findByText('Ethereum')).toBeInTheDocument();
  });
});