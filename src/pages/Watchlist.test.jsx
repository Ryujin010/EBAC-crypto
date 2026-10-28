import { screen, fireEvent } from '@testing-library/react';
import Watchlist from './Watchlist';
import { renderWithProviders } from '../utils/testUtils';
import { getMarkets } from '../services/coinsService';
import { mockCoins } from '../utils/mockData';

jest.mock('../services/coinsService');

describe('Página Watchlist', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('muestra un mensaje cuando no hay monedas guardadas', () => {
    renderWithProviders(<Watchlist />);

    expect(screen.getByText(/aún no has guardado/i)).toBeInTheDocument();
    expect(getMarkets).not.toHaveBeenCalled();
  });

  it('muestra solo las monedas guardadas', async () => {
    getMarkets.mockResolvedValue(mockCoins);
    renderWithProviders(<Watchlist />, {
      preloadedState: { watchlist: { ids: ['bitcoin'] } },
    });

    expect(await screen.findByText('Bitcoin')).toBeInTheDocument();
    expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
  });

  it('quita una moneda al desmarcarla', async () => {
    getMarkets.mockResolvedValue(mockCoins);
    const { store } = renderWithProviders(<Watchlist />, {
      preloadedState: { watchlist: { ids: ['bitcoin'] } },
    });
    await screen.findByText('Bitcoin');

    fireEvent.click(screen.getByRole('button', { name: /quitar bitcoin/i }));

    expect(store.getState().watchlist.ids).toEqual([]);
    expect(screen.getByText(/aún no has guardado/i)).toBeInTheDocument();
  });

  it('muestra el error si falla la petición', async () => {
    getMarkets.mockRejectedValue({ response: { status: 500 } });
    renderWithProviders(<Watchlist />, {
      preloadedState: { watchlist: { ids: ['bitcoin'] } },
    });

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /no está disponible/i,
    );
  });
});