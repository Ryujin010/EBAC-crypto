import reducer, {
  addCoin,
  removeCoin,
  toggleCoin,
  clearWatchlist,
} from './watchlistSlice';

describe('watchlistSlice', () => {
  it('tiene un estado inicial vacío', () => {
    expect(reducer(undefined, { type: 'desconocida' })).toEqual({ ids: [] });
  });

  it('agrega una moneda sin duplicarla', () => {
    let state = reducer(undefined, addCoin('bitcoin'));
    state = reducer(state, addCoin('bitcoin'));
    expect(state.ids).toEqual(['bitcoin']);
  });

  it('elimina una moneda', () => {
    const state = reducer({ ids: ['bitcoin', 'ethereum'] }, removeCoin('bitcoin'));
    expect(state.ids).toEqual(['ethereum']);
  });

  it('alterna una moneda (agrega y quita)', () => {
    let state = reducer(undefined, toggleCoin('solana'));
    expect(state.ids).toEqual(['solana']);
    state = reducer(state, toggleCoin('solana'));
    expect(state.ids).toEqual([]);
  });

  it('vacía la watchlist', () => {
    const state = reducer({ ids: ['bitcoin', 'ethereum'] }, clearWatchlist());
    expect(state.ids).toEqual([]);
  });
});