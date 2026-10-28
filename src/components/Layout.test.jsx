import { screen, fireEvent } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import { renderWithProviders } from '../utils/testUtils';

function Boom() {
  throw new Error('boom');
}

const renderLayout = (route = '/') =>
  renderWithProviders(
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<p>Contenido de inicio</p>} />
        <Route path="/boom" element={<Boom />} />
        <Route path="/coins" element={<p>Página de monedas</p>} />
      </Route>
    </Routes>,
    { route },
  );

describe('Layout', () => {
  it('incluye el enlace para saltar al contenido principal', () => {
    renderLayout();

    expect(
      screen.getByRole('link', { name: /saltar al contenido/i }),
    ).toHaveAttribute('href', '#main');
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
  });

  it('muestra la barra de navegación, el contenido y el pie de página', () => {
    renderLayout();

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('Contenido de inicio')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  describe('cuando una página falla al renderizar', () => {
    let consoleError;

    beforeEach(() => {
      // React escribe el error en consola: lo silenciamos solo en estas pruebas
      consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleError.mockRestore();
    });

    it('muestra un mensaje de error y mantiene la navegación', () => {
      renderLayout('/boom');

      expect(screen.getByRole('alert')).toHaveTextContent(/algo salió mal/i);
      expect(screen.getByRole('link', { name: 'Coins' })).toBeInTheDocument();
    });

    it('se recupera al navegar a otra página', () => {
      renderLayout('/boom');
      expect(screen.getByRole('alert')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('link', { name: 'Coins' }));

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByText('Página de monedas')).toBeInTheDocument();
    });
  });
});