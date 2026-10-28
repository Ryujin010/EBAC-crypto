import { screen } from '@testing-library/react';
import TrendingList from './TrendingList';
import { renderWithProviders } from '../utils/testUtils';
import { mockTrending } from '../utils/mockData';

describe('TrendingList', () => {
  it('enlaza cada moneda con su página de detalle', () => {
    renderWithProviders(<TrendingList coins={mockTrending} />);
    expect(screen.getByRole('link', { name: /pepe/i })).toHaveAttribute(
      'href',
      '/coins/pepe',
    );
  });

  it('muestra el ranking de capitalización', () => {
    renderWithProviders(<TrendingList coins={mockTrending} />);
    expect(screen.getByText('#30')).toBeInTheDocument();
  });

  it('omite el ranking cuando la moneda no lo tiene', () => {
    renderWithProviders(
      <TrendingList coins={[{ ...mockTrending[0], rank: null }]} />,
    );
    expect(screen.queryByText(/^#/)).not.toBeInTheDocument();
  });
});