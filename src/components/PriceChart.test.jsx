import { render, screen } from '@testing-library/react';
import PriceChart from './PriceChart';

jest.mock('recharts', () => {
  const React = jest.requireActual('react');
  const Box = ({ children }) => React.createElement('div', null, children);

  return {
    ResponsiveContainer: Box,
    AreaChart: ({ children }) =>
      React.createElement(
        'div',
        null,
        React.Children.toArray(children).filter(
          (child) => child.type !== 'defs',
        ),
      ),
    Area: () => null,
    CartesianGrid: () => null,
    XAxis: ({ tickFormatter }) =>
      React.createElement(
        'span',
        { 'data-testid': 'x-tick' },
        tickFormatter(1700000000000),
      ),
    YAxis: ({ tickFormatter }) =>
      React.createElement(
        'span',
        { 'data-testid': 'y-tick' },
        tickFormatter(1234.567),
      ),
    Tooltip: ({ formatter, labelFormatter }) =>
      React.createElement(
        'span',
        { 'data-testid': 'tooltip' },
        `${labelFormatter(1700000000000)} | ${formatter(250)[0]}`,
      ),
  };
});

const prices = [
  { timestamp: 1700000000000, price: 100 },
  { timestamp: 1700003600000, price: 250 },
];

describe('PriceChart', () => {
  it('incluye un resumen accesible con el precio mínimo y máximo', () => {
    render(<PriceChart prices={prices} currency="usd" days={7} />);
    expect(
      screen.getByText(/precio mínimo fue \$100\.00 y el máximo \$250\.00/i),
    ).toBeInTheDocument();
  });

  it('indica la moneda en la que se muestran los precios', () => {
    render(<PriceChart prices={prices} currency="mxn" days={7} />);
    expect(screen.getByText('Precio en MXN')).toBeInTheDocument();
  });

  it('muestra fechas en el eje X cuando el rango es de varios días', () => {
    render(<PriceChart prices={prices} days={7} />);
    expect(screen.getByTestId('x-tick').textContent).toMatch(/nov/i);
  });

  it('muestra horas en el eje X cuando el rango es de 24 horas', () => {
    render(<PriceChart prices={prices} days={1} />);
    expect(screen.getByTestId('x-tick').textContent).toMatch(/\d{1,2}:\d{2}/);
  });

  it('abrevia los precios del eje Y', () => {
    render(<PriceChart prices={prices} days={7} />);
    expect(screen.getByTestId('y-tick')).toHaveTextContent('1,235');
  });

  it('formatea el precio en el tooltip', () => {
    render(<PriceChart prices={prices} currency="usd" days={7} />);
    expect(screen.getByTestId('tooltip').textContent).toContain('$250.00');
  });
});