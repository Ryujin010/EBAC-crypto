import { renderHook, act } from '@testing-library/react';
import useDebounce from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('devuelve el valor inicial de inmediato', () => {
    const { result } = renderHook(() => useDebounce('a', 300));
    expect(result.current).toBe('a');
  });

  it('actualiza el valor solo después del retraso', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } },
    );

    rerender({ value: 'b' });
    expect(result.current).toBe('a');

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('b');
  });
});