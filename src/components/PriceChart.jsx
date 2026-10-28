import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatCurrency } from '../utils/formatters';

const formatTick = (timestamp, days) => {
  const date = new Date(timestamp);
  return days <= 1
    ? date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
};

const formatAxisPrice = (value) =>
  value.toLocaleString('en-US', {
    maximumFractionDigits: value >= 100 ? 0 : value >= 1 ? 2 : 6,
  });

function PriceChart({ prices, currency = 'usd', days = 7 }) {
  const values = prices.map((point) => point.price);
  const min = Math.min(...values);
  const max = Math.max(...values);

  return (
    <div className="price-chart">
      <p className="sr-only">
        En el periodo seleccionado, el precio mínimo fue{' '}
        {formatCurrency(min, currency)} y el máximo{' '}
        {formatCurrency(max, currency)}.
      </p>
      <p className="muted">Precio en {currency.toUpperCase()}</p>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={prices} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f8cff" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#4f8cff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#242b3d" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(timestamp) => formatTick(timestamp, days)}
            tick={{ fill: '#8b93a7', fontSize: 12 }}
            stroke="#242b3d"
            minTickGap={40}
          />
          <YAxis
            domain={['auto', 'auto']}
            tickFormatter={formatAxisPrice}
            tick={{ fill: '#8b93a7', fontSize: 12 }}
            stroke="#242b3d"
            width={64}
          />
          <Tooltip
            contentStyle={{
              background: '#151a28',
              border: '1px solid #242b3d',
              borderRadius: 8,
            }}
            labelStyle={{ color: '#8b93a7' }}
            itemStyle={{ color: '#e6e9f2' }}
            labelFormatter={(timestamp) =>
              new Date(timestamp).toLocaleString('es-MX')
            }
            formatter={(value) => [formatCurrency(value, currency), 'Precio']}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#4f8cff"
            strokeWidth={2}
            fill="url(#priceFill)"
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PriceChart;