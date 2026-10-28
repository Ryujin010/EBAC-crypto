import { loadWatchlist, saveWatchlist } from './storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('devuelve un arreglo vacío si no hay nada guardado', () => {
    expect(loadWatchlist()).toEqual([]);
  });

  it('guarda y recupera los ids', () => {
    saveWatchlist(['bitcoin', 'ethereum']);
    expect(loadWatchlist()).toEqual(['bitcoin', 'ethereum']);
  });

  it('devuelve un arreglo vacío si el contenido está corrupto', () => {
    localStorage.setItem('crypto-tracker:watchlist', '{no es json');
    expect(loadWatchlist()).toEqual([]);
  });

  it('devuelve un arreglo vacío si el JSON válido no es un arreglo', () => {
    localStorage.setItem('crypto-tracker:watchlist', '{"id":"bitcoin"}');
    expect(loadWatchlist()).toEqual([]);
  });

  it('no lanza error si localStorage no permite guardar', () => {
    const setItem = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('cuota llena');
      });

    expect(() => saveWatchlist(['bitcoin'])).not.toThrow();

    setItem.mockRestore();
  });
});