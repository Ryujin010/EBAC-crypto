import { memo } from 'react';
import { Link } from 'react-router-dom';
import WatchlistButton from './WatchlistButton';
import {
  formatCurrency,
  formatCompact,
  formatPercent,
  changeClass,
} from '../utils/formatters';
import './CoinTable.scss';

function CoinTable({ coins, currency = 'usd' }) {
  return (
    <div className="coin-table-wrapper">
      <table className="coin-table">
        <caption className="sr-only">Lista de criptomonedas</caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Moneda</th>
            <th scope="col">Precio</th>
            <th scope="col">24h</th>
            <th scope="col">Cap. de mercado</th>
            <th scope="col">
              <span className="sr-only">Watchlist</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr key={coin.id}>
              <td data-label="#">{coin.market_cap_rank ?? '—'}</td>
              <td data-label="Moneda">
                <Link to={`/coins/${coin.id}`} className="coin-table__name">
                  <img
                    src={coin.image}
                    alt=""
                    width="28"
                    height="28"
                    loading="lazy"
                  />
                  <span>{coin.name}</span>
                  <span className="muted">{coin.symbol.toUpperCase()}</span>
                </Link>
              </td>
              <td data-label="Precio">
                {formatCurrency(coin.current_price, currency)}
              </td>
              <td data-label="24h">
                <span className={changeClass(coin.price_change_percentage_24h)}>
                  {formatPercent(coin.price_change_percentage_24h)}
                </span>
              </td>
              <td data-label="Cap. de mercado">
                {formatCompact(coin.market_cap, currency)}
              </td>
              <td data-label="Watchlist">
                <WatchlistButton coinId={coin.id} coinName={coin.name} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// obs: si la página se vuelve a renderizar con las mismas monedas, la tabla no se recalcula

export default memo(CoinTable);