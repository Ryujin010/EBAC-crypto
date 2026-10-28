import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCoinDetail, getCoinChart } from '../../services/coinsService';
import { getErrorMessage } from '../../services/api';

export const fetchCoinDetail = createAsyncThunk(
  'coinDetail/fetchCoinDetail',
  async (id, { signal, rejectWithValue }) => {
    try {
      return await getCoinDetail(id, { signal });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchCoinChart = createAsyncThunk(
  'coinDetail/fetchCoinChart',
  async ({ id, vsCurrency, days }, { signal, rejectWithValue }) => {
    try {
      return await getCoinChart(id, { vsCurrency, days, signal });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const initialState = {
  data: null,
  status: 'idle',
  error: null,
  chart: {
    coinId: null,
    prices: [],
    status: 'idle',
    error: null,
  },
};

const coinDetailSlice = createSlice({
  name: 'coinDetail',
  initialState,
  reducers: {
    clearCoinDetail() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoinDetail.pending, (state, action) => {
      
        // Si cambiamos de moneda, no mostramos los datos de la anterior
      
        if (state.data?.id !== action.meta.arg) state.data = null;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCoinDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchCoinDetail.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.status = 'failed';
        state.error = action.payload ?? action.error.message;
      })
      .addCase(fetchCoinChart.pending, (state, action) => {
        if (state.chart.coinId !== action.meta.arg.id) state.chart.prices = [];
        state.chart.status = 'loading';
        state.chart.error = null;
      })
      .addCase(fetchCoinChart.fulfilled, (state, action) => {
        state.chart.status = 'succeeded';
        state.chart.coinId = action.meta.arg.id;
        state.chart.prices = action.payload;
      })
      .addCase(fetchCoinChart.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.chart.status = 'failed';
        state.chart.error = action.payload ?? action.error.message;
      });
  },
});

export const { clearCoinDetail } = coinDetailSlice.actions;

export const selectCoinDetail = (state) => state.coinDetail.data;
export const selectCoinDetailStatus = (state) => state.coinDetail.status;
export const selectCoinDetailError = (state) => state.coinDetail.error;
export const selectChart = (state) => state.coinDetail.chart;

export default coinDetailSlice.reducer;