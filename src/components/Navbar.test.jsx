import { screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';
import { renderWithProviders } from '../utils/testUtils';

describe('Navbar', () => {
  it('muestra los enlaces y el contador de la watchlist', () => {
    renderWithProviders(<Navbar />, {
      preloadedState: { watchlist: { ids: ['a', 'b', 'c'] } },
    });

    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Coins' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /watchlist ★ \(3\)/i }),
    ).toBeInTheDocument();
  });

  it('abre y cierra el menú móvil con el botón', () => {
    renderWithProviders(<Navbar />);
    const toggle = screen.getByRole('button', { name: /abrir menú/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('cierra el menú con la tecla Escape', () => {
    renderWithProviders(<Navbar />);
    const toggle = screen.getByRole('button', { name: /abrir menú/i });

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});