import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader', () => {
  it('muestra el texto por defecto', () => {
    render(<Loader />);
    expect(screen.getByRole('status')).toHaveTextContent('Cargando…');
  });

  it('permite personalizar el texto', () => {
    render(<Loader label="Cargando gráfica…" />);
    expect(screen.getByRole('status')).toHaveTextContent('Cargando gráfica…');
  });
});