import { Link } from 'react-router-dom';
import './TrendingList.scss';

function TrendingList({ coins }) {
  return (
    <ul className="trending">
      {coins.map((coin) => (
        <li key={coin.id}>
          <Link to={`/coins/${coin.id}`} className="trending__link">
            <img src={coin.thumb} alt="" width="24" height="24" />
            <span>{coin.name}</span>
            <span className="muted">{coin.symbol}</span>
            {coin.rank && (
              <span className="trending__rank muted">#{coin.rank}</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default TrendingList;