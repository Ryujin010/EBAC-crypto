import { screen, fireEvent, waitFor } from '@testing-library/react';
import Coins from './Coins';
import { renderWithProviders } from '../utils/testUtils';
import { getMarkets, searchCoins } from '../services/coinsService';
import { mockCoins } from '../utils/mockData';

jest.mock('../services/coinsService');

// 20 monedas = una página completa, así que "Siguiente" queda habilitado

const fullPage = Array.from({ length: 20 }, (_, index) => ({
  ...mockCoins[0],
  id: `coin-${index}`,
  name: `Coin ${index}`,
}));

describe('Página Coins', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('muestra el indicador de carga y luego la tabla', async () => {
    getMarkets.mockResolvedValue(mockCoins);
    renderWithProviders(<Coins />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(await screen.findByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('muestra el error y permite reintentar', async () => {
    getMarkets.mockRejectedValueOnce({ response: { status: 429 } });
    getMarkets.mockResolvedValueOnce(mockCoins);
    renderWithProviders(<Coins />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /demasiadas solicitudes/i,
    );

    fireEvent.click(screen.getByRole('button', { name: /reintentar/i }));

    expect(await screen.findByText('Bitcoin')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('avisa cuando no hay resultados', async () => {
    getMarkets.mockResolvedValue([]);
    renderWithProviders(<Coins />);

    expect(
      await screen.findByText(/no se encontraron monedas/i),
    ).toBeInTheDocument();
  });

  it('busca monedas después de que el usuario deja de escribir', async () => {
    getMarkets.mockResolvedValue(mockCoins);
    searchCoins.mockResolvedValue([{ id: 'ethereum' }]);
    renderWithProviders(<Coins />);
    await screen.findByText('Bitcoin');

    fireEvent.change(screen.getByLabelText(/buscar moneda/i), {
      target: { value: 'eth' },
    });

    await waitFor(
      () =>
        expect(searchCoins).toHaveBeenCalledWith('eth', expect.any(Object)),
      { timeout: 2000 },
    );
    await waitFor(() =>
      expect(getMarkets).toHaveBeenLastCalledWith(
        expect.objectContaining({ ids: ['ethereum'] }),
      ),
    );
  });

  it('deshabilita "Siguiente" si la lista no llena una página', async () => {
    getMarkets.mockResolvedValue(mockCoins);
    renderWithProviders(<Coins />);
    await screen.findByText('Bitcoin');

    expect(screen.getByRole('button', { name: /siguiente/i })).toBeDisabled();
  });

  it('pide la siguiente página al pulsar "Siguiente"', async () => {
    getMarkets.mockResolvedValue(fullPage);
    renderWithProviders(<Coins />);
    await screen.findByText('Coin 0');

    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));

    expect(await screen.findByText('Página 2')).toBeInTheDocument();
    await waitFor(() =>
      expect(getMarkets).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 2 }),
      ),
    );
  });
});