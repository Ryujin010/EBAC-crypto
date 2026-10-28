import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useWatchlist from '../hooks/useWatchlist';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { selectFilters } from '../features/coins/coinsSlice';
import {
  fetchWatchlistCoins,
  selectWatchlistCoins,
  selectWatchlistCoinsStatus,
  selectWatchlistCoinsError,
} from '../features/watchlist/watchlistCoinsSlice';
import CoinTable from '../components/CoinTable';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

function Watchlist() {
  const dispatch = useDispatch();
  const { ids } = useWatchlist();
  const items = useSelector(selectWatchlistCoins);
  const status = useSelector(selectWatchlistCoinsStatus);
  const error = useSelector(selectWatchlistCoinsError);
  const { vsCurrency } = useSelector(selectFilters);

  useDocumentTitle('Mi Watchlist');

  // Los datos se piden al entrar o al cambiar la moneda

  useEffect(() => {
    const request = dispatch(fetchWatchlistCoins());
    return () => request.abort();
  }, [dispatch, vsCurrency]);

  // Al quitar una moneda desaparece al instante, sin nueva petición.
  // useMemo evita volver a filtrar si ni los datos ni los ids cambiaron.
  
  const coins = useMemo(
    () => items.filter((coin) => ids.includes(coin.id)),
    [items, ids],
  );
  const isLoading = status === 'idle' || status === 'loading';

  if (ids.length === 0) {
    return (
      <section className="page">
        <h1>Mi Watchlist</h1>
        <p className="muted">
          Aún no has guardado ninguna moneda. Pulsa ☆ en la lista de monedas
          para agregarla aquí.
        </p>
        <Link to="/coins" className="btn">
          Explorar monedas
        </Link>
      </section>
    );
  }

  return (
    <section className="page">
      <h1>Mi Watchlist</h1>

      {status === 'failed' && (
        <ErrorMessage
          message={error}
          onRetry={() => dispatch(fetchWatchlistCoins())}
        />
      )}

      {isLoading && coins.length === 0 && <Loader />}

      {status === 'succeeded' && coins.length === 0 && (
        <p className="muted">No pudimos cargar los datos de tus monedas.</p>
      )}

      {coins.length > 0 && status !== 'failed' && (
        <div className={status === 'loading' ? 'is-refreshing' : undefined}>
          <CoinTable coins={coins} currency={vsCurrency} />
        </div>
      )}
    </section>
  );
}

export default Watchlist;