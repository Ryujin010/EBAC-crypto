import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('muestra el año actual', () => {
    render(<Footer />);
    const year = String(new Date().getFullYear());
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  it('da crédito a CoinGecko', () => {
    render(<Footer />);
    expect(screen.getByText(/datos de coingecko/i)).toBeInTheDocument();
  });
});