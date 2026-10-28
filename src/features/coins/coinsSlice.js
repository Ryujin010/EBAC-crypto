import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import {
  getMarkets,
  searchCoins,
  getTrending,
} from '../../services/coinsService';
import { getErrorMessage } from '../../services/api';

// Lee los filtros del estado, así los componentes solo hacen dispatch(fetchCoins())

export const fetchCoins = createAsyncThunk(
  'coins/fetchCoins',
  async (_, { getState, signal, rejectWithValue }) => {
    const { page, perPage, query, vsCurrency, sortBy } = getState().coins;
    try {
      const text = query.trim();

      if (text) {
        const found = await searchCoins(text, { signal });
        const ids = found.slice(0, perPage).map((coin) => coin.id);
        if (ids.length === 0) return [];
        return await getMarkets({
          vsCurrency,
          order: sortBy,
          perPage,
          ids,
          signal,
        });
      }

      return await getMarkets({
        vsCurrency,
        order: sortBy,
        perPage,
        page,
        signal,
      });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchTrending = createAsyncThunk(
  'coins/fetchTrending',
  async (_, { signal, rejectWithValue }) => {
    try {
      return await getTrending({ signal });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  page: 1,
  perPage: 20,
  query: '',
  vsCurrency: 'usd',
  sortBy: 'market_cap_desc',
  trending: {
    items: [],
    status: 'idle',
    error: null,
  },
};

const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },

    // Al cambiar un filtro volvemos a la página 1

    setQuery(state, action) {
      state.query = action.payload;
      state.page = 1;
    },
    setVsCurrency(state, action) {
      state.vsCurrency = action.payload;
      state.page = 1;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
      state.page = 1;
    },
    resetFilters(state) {
      state.query = initialState.query;
      state.vsCurrency = initialState.vsCurrency;
      state.sortBy = initialState.sortBy;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCoins.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCoins.rejected, (state, action) => {

        // Una petición cancelada no es un error: ya viene otra en camino

        if (action.meta.aborted) return;
        state.status = 'failed';
        state.error = action.payload ?? action.error.message;
      })
      .addCase(fetchTrending.pending, (state) => {
        state.trending.status = 'loading';
        state.trending.error = null;
      })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.trending.status = 'succeeded';
        state.trending.items = action.payload;
      })
      .addCase(fetchTrending.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.trending.status = 'failed';
        state.trending.error = action.payload ?? action.error.message;
      });
  },
});

export const { setPage, setQuery, setVsCurrency, setSortBy, resetFilters } =
  coinsSlice.actions;

export const selectCoins = (state) => state.coins.items;
export const selectCoinsStatus = (state) => state.coins.status;
export const selectCoinsError = (state) => state.coins.error;
export const selectTrending = (state) => state.coins.trending.items;
export const selectTrendingStatus = (state) => state.coins.trending.status;
export const selectTrendingError = (state) => state.coins.trending.error;

// createSelector memoriza el resultado: solo crea un objeto nuevo si cambia algún filtro

export const selectFilters = createSelector(
  [
    (state) => state.coins.page,
    (state) => state.coins.perPage,
    (state) => state.coins.query,
    (state) => state.coins.vsCurrency,
    (state) => state.coins.sortBy,
  ],
  (page, perPage, query, vsCurrency, sortBy) => ({
    page,
    perPage,
    query,
    vsCurrency,
    sortBy,
  }),
);

export default coinsSlice.reducer;