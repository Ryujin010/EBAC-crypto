
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCoins,
  selectCoins,
  selectCoinsStatus,
  selectCoinsError,
  selectFilters,
  setPage,
  setQuery,
} from '../features/coins/coinsSlice';
import useDocumentTitle from '../hooks/useDocumentTitle';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import CoinTable from '../components/CoinTable';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

function Coins() {
  const dispatch = useDispatch();
  const coins = useSelector(selectCoins);
  const status = useSelector(selectCoinsStatus);
  const error = useSelector(selectCoinsError);
  const { page, perPage, query, vsCurrency, sortBy } =
    useSelector(selectFilters);

  useDocumentTitle('Monedas');

  // Cada cambio de filtro lanza una petición nueva y cancela la anterior

  useEffect(() => {
    const request = dispatch(fetchCoins());
    return () => request.abort();
  }, [dispatch, page, query, vsCurrency, sortBy]);

  // Solo se actualiza el estado global si el texto realmente cambió
  
  const handleSearch = useCallback(
    (text) => {
      if (text !== query) dispatch(setQuery(text));
    },
    [dispatch, query],
  );

  const isLoading = status === 'idle' || status === 'loading';
  const showTable = coins.length > 0 && status !== 'failed';

  return (
    <section className="page">
      <h1>Monedas</h1>

      <div className="toolbar">
        <SearchBar initialValue={query} onSearch={handleSearch} />
        <Filters />
      </div>

      {status === 'failed' && (
        <ErrorMessage message={error} onRetry={() => dispatch(fetchCoins())} />
      )}

      {isLoading && coins.length === 0 && <Loader />}

      {showTable && (
        <div className={status === 'loading' ? 'is-refreshing' : undefined}>
          <CoinTable coins={coins} currency={vsCurrency} />
        </div>
      )}

      {status === 'succeeded' && coins.length === 0 && (
        <p className="muted">
          No se encontraron monedas{query ? ` para “${query}”` : ''}.
        </p>
      )}

      {/* La búsqueda devuelve una sola página, así que ocultamos la paginación */}
      {!query && showTable && (
        <Pagination
          page={page}
          hasNext={coins.length === perPage}
          onPageChange={(newPage) => dispatch(setPage(newPage))}
        />
      )}
    </section>
  );
}

export default Coins;