import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTrending,
  selectFilters,
  selectTrending,
  selectTrendingStatus,
  selectTrendingError,
} from '../features/coins/coinsSlice';
import {
  fetchTopCoins,
  selectTopCoins,
  selectTopCoinsStatus,
  selectTopCoinsError,
} from '../features/coins/topCoinsSlice';
import useDocumentTitle from '../hooks/useDocumentTitle';
import CoinTable from '../components/CoinTable';
import TrendingList from '../components/TrendingList';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import './Dashboard.scss';

function Dashboard() {
  const dispatch = useDispatch();
  const { vsCurrency } = useSelector(selectFilters);

  const topCoins = useSelector(selectTopCoins);
  const topStatus = useSelector(selectTopCoinsStatus);
  const topError = useSelector(selectTopCoinsError);

  const trending = useSelector(selectTrending);
  const trendingStatus = useSelector(selectTrendingStatus);
  const trendingError = useSelector(selectTrendingError);

  useDocumentTitle('Mercado cripto');

  useEffect(() => {
    const request = dispatch(fetchTrending());
    return () => request.abort();
  }, [dispatch]);

  useEffect(() => {
    const request = dispatch(fetchTopCoins());
    return () => request.abort();
  }, [dispatch, vsCurrency]);

  const topLoading = topStatus === 'idle' || topStatus === 'loading';
  const trendingLoading =
    trendingStatus === 'idle' || trendingStatus === 'loading';

  return (
    <section className="page">
      <h1>Mercado cripto</h1>
      <p className="muted">Datos de mercado de CoinGecko.</p>

      <div className="dashboard">
        <div>
          <h2>Top 5 por capitalización</h2>
          {topStatus === 'failed' && (
            <ErrorMessage
              message={topError}
              onRetry={() => dispatch(fetchTopCoins())}
            />
          )}
          {topLoading && topCoins.length === 0 && <Loader />}
          {topCoins.length > 0 && topStatus !== 'failed' && (
            <CoinTable coins={topCoins} currency={vsCurrency} />
          )}
          <Link to="/coins" className="dashboard__more">
            Ver todas las monedas →
          </Link>
        </div>

        <aside>
          <h2>En tendencia</h2>
          {trendingStatus === 'failed' && (
            <ErrorMessage
              message={trendingError}
              onRetry={() => dispatch(fetchTrending())}
            />
          )}
          {trendingLoading && trending.length === 0 && <Loader />}
          {trending.length > 0 && trendingStatus !== 'failed' && (
            <TrendingList coins={trending.slice(0, 7)} />
          )}
        </aside>
      </div>
    </section>
  );
}

export default Dashboard;