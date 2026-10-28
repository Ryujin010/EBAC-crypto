import { useDispatch, useSelector } from 'react-redux';
import {
  selectFilters,
  setVsCurrency,
  setSortBy,
} from '../features/coins/coinsSlice';

const CURRENCIES = [
  { value: 'usd', label: 'USD' },
  { value: 'mxn', label: 'MXN' },
  { value: 'eur', label: 'EUR' },
];

const SORT_OPTIONS = [
  { value: 'market_cap_desc', label: 'Capitalización (mayor a menor)' },
  { value: 'market_cap_asc', label: 'Capitalización (menor a mayor)' },
  { value: 'volume_desc', label: 'Volumen (mayor a menor)' },
  { value: 'id_asc', label: 'Nombre (A-Z)' },
];

function Filters() {
  const dispatch = useDispatch();
  const { vsCurrency, sortBy } = useSelector(selectFilters);

  return (
    <div className="filters">
      <div className="field">
        <label htmlFor="currency">Moneda</label>
        <select
          id="currency"
          value={vsCurrency}
          onChange={(event) => dispatch(setVsCurrency(event.target.value))}
        >
          {CURRENCIES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="sort">Ordenar por</label>
        <select
          id="sort"
          value={sortBy}
          onChange={(event) => dispatch(setSortBy(event.target.value))}
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Filters;