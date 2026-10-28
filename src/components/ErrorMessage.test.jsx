import { render, screen, fireEvent } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage', () => {
  it('muestra el mensaje como una alerta', () => {
    render(<ErrorMessage message="Algo falló" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Algo falló');
  });

  it('no muestra el botón si no hay función para reintentar', () => {
    render(<ErrorMessage message="Algo falló" />);
    expect(
      screen.queryByRole('button', { name: /reintentar/i }),
    ).not.toBeInTheDocument();
  });

  it('llama a onRetry al pulsar "Reintentar"', () => {
    const onRetry = jest.fn();
    render(<ErrorMessage message="Algo falló" onRetry={onRetry} />);

    fireEvent.click(screen.getByRole('button', { name: /reintentar/i }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});