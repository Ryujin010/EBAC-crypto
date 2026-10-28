import { screen, fireEvent, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import CoinDetail from './CoinDetail';
import { renderWithProviders } from '../utils/testUtils';
import { getCoinDetail, getCoinChart } from '../services/coinsService';
import { mockDetail } from '../utils/mockData';

jest.mock('../services/coinsService');

// La gráfica real se prueba aparte (PriceChart.test.jsx)

jest.mock('../components/PriceChart', () => ({
  __esModule: true,
  default: () =>
    jest
      .requireActual('react')
      .createElement('div', { 'data-testid': 'price-chart' }),
}));

// La página lee el id de la URL, así que la renderizamos dentro de una ruta

const renderDetail = (id = 'bitcoin') =>
  renderWithProviders(
    <Routes>
      <Route path="/coins/:id" element={<CoinDetail />} />
    </Routes>,
    { route: `/coins/${id}` },
  );

const waitForTitle = () =>
  screen.findByRole('heading', { level: 1, name: /bitcoin/i });

describe('Página CoinDetail', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    getCoinDetail.mockResolvedValue(mockDetail);
    getCoinChart.mockResolvedValue([{ timestamp: 1, price: 65000 }]);
  });

  it('muestra el indicador de carga y luego el detalle', async () => {
    renderDetail();

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(await waitForTitle()).toBeInTheDocument();
    expect(getCoinDetail).toHaveBeenCalledWith('bitcoin', expect.any(Object));
  });

  it('muestra las estadísticas con formato', async () => {
    renderDetail();
    await waitForTitle();

    expect(screen.getByText('$65,000.00')).toBeInTheDocument();
    expect(screen.getByText('+2.50%')).toHaveClass('up');
    expect(screen.getByText('$66,000.00')).toBeInTheDocument();
    expect(screen.getByText('$64,000.00')).toBeInTheDocument();
    expect(screen.getByText('$73,000.00')).toBeInTheDocument();
    expect(screen.getByText('$1.3T')).toBeInTheDocument();
    expect(screen.getByText('$30B')).toBeInTheDocument();
    expect(screen.getByText('19.7M')).toBeInTheDocument();
  });

  it('muestra la descripción como texto plano, sin etiquetas HTML', async () => {
    renderDetail();

    expect(
      await screen.findByText('Bitcoin es una moneda digital.'),
    ).toBeInTheDocument();
    expect(screen.queryByText(/<a /)).not.toBeInTheDocument();
  });

  it('enlaza al sitio oficial de forma segura', async () => {
    renderDetail();

    const link = await screen.findByRole('link', { name: /sitio oficial/i });
    expect(link).toHaveAttribute('href', 'https://bitcoin.org');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('oculta el enlace si la moneda no tiene sitio oficial', async () => {
    getCoinDetail.mockResolvedValue({ ...mockDetail, homepage: '' });
    renderDetail();
    await waitForTitle();

    expect(
      screen.queryByRole('link', { name: /sitio oficial/i }),
    ).not.toBeInTheDocument();
  });

  it('recorta las descripciones muy largas', async () => {
    getCoinDetail.mockResolvedValue({
      ...mockDetail,
      description: 'a'.repeat(700),
    });
    renderDetail();

    expect(
      await screen.findByText(`${'a'.repeat(600)}…`),
    ).toBeInTheDocument();
  });

  it('muestra el error si falla la petición y permite reintentar', async () => {
    getCoinDetail.mockRejectedValueOnce({ response: { status: 404 } });
    renderDetail();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /no se encontró/i,
    );

    fireEvent.click(screen.getByRole('button', { name: /reintentar/i }));

    expect(await waitForTitle()).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('pide la gráfica del rango elegido', async () => {
    renderDetail();
    await waitForTitle();

    fireEvent.click(screen.getByRole('button', { name: '30d' }));

    expect(screen.getByRole('button', { name: '30d' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await waitFor(() =>
      expect(getCoinChart).toHaveBeenLastCalledWith(
        'bitcoin',
        expect.objectContaining({ days: 30, vsCurrency: 'usd' }),
      ),
    );
  });

  it('muestra la gráfica cuando llegan los datos', async () => {
    renderDetail();
    await waitForTitle();

    expect(await screen.findByTestId('price-chart')).toBeInTheDocument();
  });

  it('muestra el error de la gráfica sin ocultar el detalle', async () => {
    getCoinChart.mockRejectedValue({ code: 'ECONNABORTED' });
    renderDetail();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /tardó demasiado/i,
    );
    expect(await waitForTitle()).toBeInTheDocument();
  });

  it('actualiza el título de la pestaña con el nombre de la moneda', async () => {
    renderDetail();

    await waitFor(() =>
      expect(document.title).toBe('Bitcoin | Crypto Tracker'),
    );
  });

  it('agrega la moneda a la watchlist desde el encabezado', async () => {
    const { store } = renderDetail();
    await waitForTitle();

    fireEvent.click(
      screen.getByRole('button', { name: /agregar bitcoin a la watchlist/i }),
    );

    expect(store.getState().watchlist.ids).toEqual(['bitcoin']);
  });
});