import { screen } from '@testing-library/react';
import NotFound from './NotFound';
import { renderWithProviders } from '../utils/testUtils';

describe('Página NotFound', () => {
  it('muestra el encabezado 404', () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument();
  });

  it('ofrece un enlace para volver al inicio', () => {
    renderWithProviders(<NotFound />);
    expect(
      screen.getByRole('link', { name: /volver al inicio/i }),
    ).toHaveAttribute('href', '/');
  });

  it('actualiza el título de la pestaña', () => {
    renderWithProviders(<NotFound />);
    expect(document.title).toBe('Página no encontrada | Crypto Tracker');
  });
});