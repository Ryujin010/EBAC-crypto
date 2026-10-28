const WATCHLIST_KEY = 'crypto-tracker:watchlist';

describe('store', () => {
  beforeEach(() => {
    localStorage.clear();

    // El store se crea al importarse: reiniciamos los módulos para importarlo limpio
    
    jest.resetModules();
  });

  it('carga la watchlist guardada en localStorage al iniciar', async () => {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(['bitcoin']));

    const { store } = await import('./store');

    expect(store.getState().watchlist.ids).toEqual(['bitcoin']);
  });

  it('guarda la watchlist en localStorage cuando cambia', async () => {
    const { store } = await import('./store');
    const { addCoin } = await import('../features/watchlist/watchlistSlice');

    store.dispatch(addCoin('solana'));

    expect(JSON.parse(localStorage.getItem(WATCHLIST_KEY))).toEqual(['solana']);
  });

  it('no escribe en localStorage cuando cambia otra parte del estado', async () => {
    const { store } = await import('./store');
    const { setPage } = await import('../features/coins/coinsSlice');
    const setItem = jest.spyOn(Storage.prototype, 'setItem');

    store.dispatch(setPage(2));

    expect(setItem).not.toHaveBeenCalled();
    setItem.mockRestore();
  });
});