import { render, screen, fireEvent, act } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('muestra el valor inicial', () => {
    render(<SearchBar initialValue="btc" onSearch={() => {}} />);
    expect(screen.getByLabelText(/buscar moneda/i)).toHaveValue('btc');
  });

  it('espera el debounce y envía el texto sin espacios sobrantes', () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} delay={500} />);

    fireEvent.change(screen.getByLabelText(/buscar moneda/i), {
      target: { value: '  eth ' },
    });
    act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(onSearch).not.toHaveBeenCalledWith('eth');

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(onSearch).toHaveBeenLastCalledWith('eth');
  });

  it('ignora los textos intermedios mientras el usuario sigue escribiendo', () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} delay={500} />);
    const input = screen.getByLabelText(/buscar moneda/i);

    fireEvent.change(input, { target: { value: 'e' } });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    fireEvent.change(input, { target: { value: 'et' } });
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onSearch).not.toHaveBeenCalledWith('e');
    expect(onSearch).toHaveBeenLastCalledWith('et');
  });
});