import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setupStore } from '../app/store';
import useWatchlist from './useWatchlist';

const createWrapper = (store) =>
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  };

describe('useWatchlist', () => {
  it('empieza vacío', () => {
    const store = setupStore();
    const { result } = renderHook(() => useWatchlist(), {
      wrapper: createWrapper(store),
    });
    expect(result.current.ids).toEqual([]);
    expect(result.current.count).toBe(0);
  });

  it('agrega y quita una moneda con toggle', () => {
    const store = setupStore();
    const { result } = renderHook(() => useWatchlist(), {
      wrapper: createWrapper(store),
    });

    act(() => result.current.toggle('bitcoin'));
    expect(result.current.isInWatchlist('bitcoin')).toBe(true);
    expect(result.current.count).toBe(1);

    act(() => result.current.toggle('bitcoin'));
    expect(result.current.isInWatchlist('bitcoin')).toBe(false);
    expect(result.current.count).toBe(0);
  });

  it('lee los ids del estado precargado', () => {
    const store = setupStore({ watchlist: { ids: ['solana', 'cardano'] } });
    const { result } = renderHook(() => useWatchlist(), {
      wrapper: createWrapper(store),
    });
    expect(result.current.count).toBe(2);
  });
});