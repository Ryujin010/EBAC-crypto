import { renderHook } from '@testing-library/react';
import useDocumentTitle from './useDocumentTitle';

describe('useDocumentTitle', () => {
  it('agrega el nombre de la app al título', () => {
    renderHook(() => useDocumentTitle('Monedas'));
    expect(document.title).toBe('Monedas | Crypto Tracker');
  });

  it('usa solo el nombre de la app si no hay título', () => {
    renderHook(() => useDocumentTitle(''));
    expect(document.title).toBe('Crypto Tracker');
  });

  it('actualiza el título cuando cambia', () => {
    const { rerender } = renderHook(({ title }) => useDocumentTitle(title), {
      initialProps: { title: 'Monedas' },
    });

    rerender({ title: 'Mi Watchlist' });
    expect(document.title).toBe('Mi Watchlist | Crypto Tracker');
  });
});