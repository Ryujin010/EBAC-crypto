import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Link } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';

describe('ScrollToTop', () => {
  beforeEach(() => {
    window.scrollTo.mockClear();
  });

  it('sube al inicio de la página cuando cambia la ruta', () => {
    render(
      <MemoryRouter>
        <ScrollToTop />
        <Link to="/otra">Ir</Link>
      </MemoryRouter>,
    );
    expect(window.scrollTo).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('link', { name: 'Ir' }));

    expect(window.scrollTo).toHaveBeenCalledTimes(2);
    expect(window.scrollTo).toHaveBeenLastCalledWith(0, 0);
  });
});