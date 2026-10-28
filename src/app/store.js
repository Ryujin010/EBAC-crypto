import { configureStore, combineReducers } from '@reduxjs/toolkit';
import coinsReducer from '../features/coins/coinsSlice';
import coinDetailReducer from '../features/coins/coinDetailSlice';
import topCoinsReducer from '../features/coins/topCoinsSlice';
import watchlistReducer from '../features/watchlist/watchlistSlice';
import watchlistCoinsReducer from '../features/watchlist/watchlistCoinsSlice';
import { loadWatchlist, saveWatchlist } from '../utils/storage';

const rootReducer = combineReducers({
  coins: coinsReducer,
  coinDetail: coinDetailReducer,
  topCoins: topCoinsReducer,
  watchlist: watchlistReducer,
  watchlistCoins: watchlistCoinsReducer,
});

// Fábrica de stores: la usan los tests para empezar con un estado limpio

export const setupStore = (preloadedState) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

// Store único de la aplicación, con la watchlist recuperada de localStorage

export const store = setupStore({
  watchlist: { ids: loadWatchlist() },
});

// Guardamos en localStorage solo cuando cambia la watchlist

let previousIds = store.getState().watchlist.ids;
store.subscribe(() => {
  const currentIds = store.getState().watchlist.ids;
  if (currentIds !== previousIds) {
    previousIds = currentIds;
    saveWatchlist(currentIds);
  }
});