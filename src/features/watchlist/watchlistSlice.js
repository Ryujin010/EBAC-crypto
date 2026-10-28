import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ids: [],
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addCoin(state, action) {
      if (!state.ids.includes(action.payload)) {
        state.ids.push(action.payload);
      }
    },
    removeCoin(state, action) {
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
    toggleCoin(state, action) {
      const id = action.payload;
      state.ids = state.ids.includes(id)
        ? state.ids.filter((coinId) => coinId !== id)
        : [...state.ids, id];
    },
    clearWatchlist(state) {
      state.ids = [];
    },
  },
});

export const { addCoin, removeCoin, toggleCoin, clearWatchlist } =
  watchlistSlice.actions;

export const selectWatchlistIds = (state) => state.watchlist.ids;

export default watchlistSlice.reducer;