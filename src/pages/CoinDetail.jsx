import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCoinDetail,
  fetchCoinChart,
  selectCoinDetail,
  selectCoinDetailStatus,
  selectCoinDetailError,
  selectChart,
} from '../features/coins/coinDetailSlice';
import { selectFilters } from '../features/coins/coinsSlice';
import useDocumentTitle from '../hooks/useDocumentTitle';
import PriceChart from '../components/PriceChart';
import WatchlistButton from '../components/WatchlistButton';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import {
  formatCurrency,
  formatCompact,
  formatNumber,
  formatPercent,
  changeClass,
  stripHtml,
} from '../utils/formatters';
import './CoinDetail.scss';

const RANGES = [
  { days: 1, label: '24h' },
  { days: 7, label: '7d' },
  { days: 30, label: '30d' },
  { days: 90, label: '90d' },
];

function CoinDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const coin = useSelector(selectCoinDetail);
  const status = useSelector(selectCoinDetailStatus);
  const error = useSelector(selectCoinDetailError);
  const chart = useSelector(selectChart);
  const { vsCurrency } = useSelector(selectFilters);
  const [days, setDays] = useState(7);

  useDocumentTitle(coin?.name ?? 'Detalle de moneda');

  useEffect(() => {
    const request = dispatch(fetchCoinDetail(id));
    return () => request.abort();
  }, [dispatch, id]);

  useEffect(() => {
    const request = dispatch(fetchCoinChart({ id, vsCurrency, days }));
    return () => request.abort();
  }, [dispatch, id, vsCurrency, days]);

  const backLink = (
    <Link to="/coins" className="coin-detail__back">
      ← Volver a monedas
    </Link>
  );

  if (status === 'failed') {
    return (
      <section className="page coin-detail">
        {backLink}
        <ErrorMessage
          message={error}
          onRetry={() => dispatch(fetchCoinDetail(id))}
        />
      </section>
    );
  }

  if (!coin) {
    return (
      <section className="page coin-detail">
        {backLink}
        <Loader />
      </section>
    );
  }

  const md = coin.marketData;
  const description = stripHtml(coin.description);
  const shortDescription =
    description.length > 600 ? `${description.slice(0, 600)}…` : description;
  const chartReady = chart.coinId === id && chart.prices.length > 0;

  const stats = [
    {
      label: 'Precio actual',
      value: formatCurrency(md.currentPrice[vsCurrency], vsCurrency),
    },
    {
      label: 'Cambio 24h',
      value: formatPercent(md.priceChange24h),
      className: changeClass(md.priceChange24h),
    },
    {
      label: 'Máximo 24h',
      value: formatCurrency(md.high24h[vsCurrency], vsCurrency),
    },
    {
      label: 'Mínimo 24h',
      value: formatCurrency(md.low24h[vsCurrency], vsCurrency),
    },
    {
      label: 'Máximo histórico',
      value: formatCurrency(md.ath[vsCurrency], vsCurrency),
    },
    {
      label: 'Cap. de mercado',
      value: formatCompact(md.marketCap[vsCurrency], vsCurrency),
    },
    {
      label: 'Volumen 24h',
      value: formatCompact(md.totalVolume[vsCurrency], vsCurrency),
    },
    {
      label: 'Suministro circulante',
      value: formatNumber(md.circulatingSupply),
    },
  ];

  return (
    <section className="page coin-detail">
      {backLink}

      <header className="coin-detail__header">
        {coin.image && <img src={coin.image} alt="" width="56" height="56" />}
        <h1>
          {coin.name} <span className="muted">{coin.symbol.toUpperCase()}</span>
        </h1>
        <WatchlistButton coinId={coin.id} coinName={coin.name} />
        {coin.rank && <span className="muted">Ranking #{coin.rank}</span>}
      </header>

      <dl className="coin-detail__stats">
        {stats.map(({ label, value, className }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd className={className}>{value}</dd>
          </div>
        ))}
      </dl>

      <h2>Historial de precios</h2>
      <div
        className="coin-detail__ranges"
        role="group"
        aria-label="Rango de tiempo"
      >
        {RANGES.map((range) => (
          <button
            key={range.days}
            type="button"
            className={`btn ${days === range.days ? 'btn--active' : ''}`}
            aria-pressed={days === range.days}
            onClick={() => setDays(range.days)}
          >
            {range.label}
          </button>
        ))}
      </div>

      {chart.status === 'failed' && (
        <ErrorMessage
          message={chart.error}
          onRetry={() => dispatch(fetchCoinChart({ id, vsCurrency, days }))}
        />
      )}
      {chart.status !== 'failed' && !chartReady && (
        <Loader label="Cargando gráfica…" />
      )}
      {chart.status !== 'failed' && chartReady && (
        <PriceChart prices={chart.prices} currency={vsCurrency} days={days} />
      )}

      {shortDescription && (
        <>
          <h2>Acerca de {coin.name}</h2>
          <p className="coin-detail__description">{shortDescription}</p>
        </>
      )}

      {coin.homepage && (
        <a
          href={coin.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
        >
          Sitio oficial ↗
        </a>
      )}
    </section>
  );
}

export default CoinDetail;