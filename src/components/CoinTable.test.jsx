import { screen } from '@testing-library/react';
import CoinTable from './CoinTable';
import { renderWithProviders } from '../utils/testUtils';
import { mockCoins } from '../utils/mockData';

describe('CoinTable', () => {
  it('muestra una fila por moneda más el encabezado', () => {
    renderWithProviders(<CoinTable coins={mockCoins} currency="usd" />);
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  it('enlaza cada moneda con su página de detalle', () => {
    renderWithProviders(<CoinTable coins={mockCoins} currency="usd" />);
    expect(screen.getByRole('link', { name: /bitcoin/i })).toHaveAttribute(
      'href',
      '/coins/bitcoin',
    );
    expect(screen.getByRole('link', { name: /ethereum/i })).toHaveAttribute(
      'href',
      '/coins/ethereum',
    );
  });

  it('formatea el precio y colorea el cambio de 24h', () => {
    renderWithProviders(<CoinTable coins={mockCoins} currency="usd" />);
    expect(screen.getByText('$65,000.50')).toBeInTheDocument();
    expect(screen.getByText('+2.50%')).toHaveClass('up');
    expect(screen.getByText('-1.20%')).toHaveClass('down');
  });

  it('permite agregar una moneda a la watchlist desde la fila', () => {
    renderWithProviders(<CoinTable coins={mockCoins} currency="usd" />);
    expect(
      screen.getByRole('button', { name: /agregar bitcoin/i }),
    ).toBeInTheDocument();
  });
});