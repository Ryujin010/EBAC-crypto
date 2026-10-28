import useWatchlist from '../hooks/useWatchlist';

function WatchlistButton({ coinId, coinName }) {
  const { isInWatchlist, toggle } = useWatchlist();
  const active = isInWatchlist(coinId);

  return (
    <button
      type="button"
      className={`star-btn ${active ? 'is-active' : ''}`}
      aria-pressed={active}
      aria-label={
        active
          ? `Quitar ${coinName} de la watchlist`
          : `Agregar ${coinName} a la watchlist`
      }
      onClick={() => toggle(coinId)}
    >
      {active ? '★' : '☆'}
    </button>
  );
}

export default WatchlistButton;