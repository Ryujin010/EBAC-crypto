import { screen, fireEvent } from '@testing-library/react';
import Dashboard from './Dashboard';
import { renderWithProviders } from '../utils/testUtils';
import { getMarkets, getTrending } from '../services/coinsService';
import { mockCoins, mockTrending } from '../utils/mockData';

jest.mock('../services/coinsService');

describe('Página Dashboard', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    getMarkets.mockResolvedValue(mockCoins);
    getTrending.mockResolvedValue(mockTrending);
  });

  it('muestra un indicador de carga por cada sección', () => {
    getMarkets.mockReturnValue(new Promise(() => {}));
    getTrending.mockReturnValue(new Promise(() => {}));
    renderWithProviders(<Dashboard />);

    expect(screen.getAllByRole('status')).toHaveLength(2);
  });

  it('muestra el top de monedas y las tendencias', async () => {
    renderWithProviders(<Dashboard />);

    expect(await screen.findByText('Bitcoin')).toBeInTheDocument();
    expect(await screen.findByText('Pepe')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /top 5 por capitalización/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /en tendencia/i }),
    ).toBeInTheDocument();
  });

  it('pide solo las 5 monedas principales', async () => {
    renderWithProviders(<Dashboard />);
    await screen.findByText('Bitcoin');

    expect(getMarkets).toHaveBeenCalledWith(
      expect.objectContaining({ perPage: 5, page: 1, vsCurrency: 'usd' }),
    );
  });

  it('un error en una sección no afecta a la otra', async () => {
    getMarkets.mockRejectedValue({ response: { status: 429 } });
    renderWithProviders(<Dashboard />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /demasiadas solicitudes/i,
    );
    expect(await screen.findByText('Pepe')).toBeInTheDocument();
  });

  it('permite reintentar la sección que falló', async () => {
    getMarkets.mockRejectedValueOnce({ response: { status: 500 } });
    renderWithProviders(<Dashboard />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /no está disponible/i,
    );

    fireEvent.click(screen.getByRole('button', { name: /reintentar/i }));

    expect(await screen.findByText('Bitcoin')).toBeInTheDocument();
  });

  it('muestra como máximo 7 monedas en tendencia', async () => {
    const many = Array.from({ length: 10 }, (_, index) => ({
      id: `token-${index}`,
      name: `Token ${index}`,
      symbol: `T${index}`,
      rank: index + 1,
      thumb: 'token.png',
    }));
    getTrending.mockResolvedValue(many);
    renderWithProviders(<Dashboard />);

    expect(await screen.findByText('Token 6')).toBeInTheDocument();
    expect(screen.queryByText('Token 7')).not.toBeInTheDocument();
  });

  it('enlaza a la lista completa de monedas', async () => {
    renderWithProviders(<Dashboard />);
    await screen.findByText('Bitcoin');

    expect(
      screen.getByRole('link', { name: /ver todas las monedas/i }),
    ).toHaveAttribute('href', '/coins');
  });
});