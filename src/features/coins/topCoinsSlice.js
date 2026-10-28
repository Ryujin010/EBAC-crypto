import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMarkets } from '../../services/coinsService';
import { getErrorMessage } from '../../services/api';

// Las 5 monedas principales para el Dashboard

export const fetchTopCoins = createAsyncThunk(
  'topCoins/fetchTopCoins',
  async (_, { getState, signal, rejectWithValue }) => {
    const { vsCurrency } = getState().coins;
    try {
      return await getMarkets({ vsCurrency, perPage: 5, page: 1, signal });
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

const topCoinsSlice = createSlice({
  name: 'topCoins',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopCoins.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTopCoins.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTopCoins.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.status = 'failed';
        state.error = action.payload ?? action.error.message;
      });
  },
});

export const selectTopCoins = (state) => state.topCoins.items;
export const selectTopCoinsStatus = (state) => state.topCoins.status;
export const selectTopCoinsError = (state) => state.topCoins.error;

export default topCoinsSlice.reducer;