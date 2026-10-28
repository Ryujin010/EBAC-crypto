import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMarkets } from '../../services/coinsService';
import { getErrorMessage } from '../../services/api';

// Datos actualizados de las monedas guardadas (el slice `watchlist` solo guarda ids)

export const fetchWatchlistCoins = createAsyncThunk(
  'watchlistCoins/fetchWatchlistCoins',
  async (_, { getState, signal, rejectWithValue }) => {
    const { ids } = getState().watchlist;
    if (ids.length === 0) return [];

    const { vsCurrency } = getState().coins;
    try {
      return await getMarkets({
        vsCurrency,
        ids,
        perPage: Math.min(ids.length, 250),
        signal,
      });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const watchlistCoinsSlice = createSlice({
  name: 'watchlistCoins',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlistCoins.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWatchlistCoins.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchWatchlistCoins.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.status = 'failed';
        state.error = action.payload ?? action.error.message;
      });
  },
});

export const selectWatchlistCoins = (state) => state.watchlistCoins.items;
export const selectWatchlistCoinsStatus = (state) =>
  state.watchlistCoins.status;
export const selectWatchlistCoinsError = (state) => state.watchlistCoins.error;

export default watchlistCoinsSlice.reducer;