import { screen, fireEvent } from '@testing-library/react';
import WatchlistButton from './WatchlistButton';
import { renderWithProviders } from '../utils/testUtils';

describe('WatchlistButton', () => {
  it('agrega y quita la moneda de la watchlist', () => {
    const { store } = renderWithProviders(
      <WatchlistButton coinId="bitcoin" coinName="Bitcoin" />,
    );

    fireEvent.click(screen.getByRole('button', { name: /agregar bitcoin/i }));
    expect(store.getState().watchlist.ids).toEqual(['bitcoin']);

    const active = screen.getByRole('button', { name: /quitar bitcoin/i });
    expect(active).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(active);
    expect(store.getState().watchlist.ids).toEqual([]);
  });

  it('aparece activo si la moneda ya está guardada', () => {
    renderWithProviders(
      <WatchlistButton coinId="bitcoin" coinName="Bitcoin" />,
      { preloadedState: { watchlist: { ids: ['bitcoin'] } } },
    );
    expect(
      screen.getByRole('button', { name: /quitar bitcoin/i }),
    ).toHaveAttribute('aria-pressed', 'true');
  });
});