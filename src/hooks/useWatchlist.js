import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectWatchlistIds,
  toggleCoin,
} from '../features/watchlist/watchlistSlice';

function useWatchlist() {
  const dispatch = useDispatch();
  const ids = useSelector(selectWatchlistIds);

  const isInWatchlist = useCallback((id) => ids.includes(id), [ids]);
  const toggle = useCallback((id) => dispatch(toggleCoin(id)), [dispatch]);

  return { ids, count: ids.length, isInWatchlist, toggle };
}

export default useWatchlist;