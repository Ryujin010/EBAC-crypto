import { withCache, clearCache } from './cache';

describe('cache', () => {
  beforeEach(() => {
    clearCache();
  });

  it('reutiliza el valor guardado dentro del TTL', async () => {
    const fetcher = jest.fn().mockResolvedValue('dato');

    expect(await withCache('k', fetcher)).toBe('dato');
    expect(await withCache('k', fetcher)).toBe('dato');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('vuelve a pedir el dato cuando el TTL expira', async () => {
    const fetcher = jest.fn().mockResolvedValue('dato');
    const now = jest.spyOn(Date, 'now').mockReturnValue(1000);

    await withCache('k', fetcher, 500);
    now.mockReturnValue(1400);
    await withCache('k', fetcher, 500);
    expect(fetcher).toHaveBeenCalledTimes(1);

    now.mockReturnValue(1600);
    await withCache('k', fetcher, 500);
    expect(fetcher).toHaveBeenCalledTimes(2);

    now.mockRestore();
  });

  it('no guarda en caché cuando el fetcher falla', async () => {
    const fetcher = jest
      .fn()
      .mockRejectedValueOnce(new Error('falló'))
      .mockResolvedValueOnce('ok');

    await expect(withCache('k', fetcher)).rejects.toThrow('falló');
    expect(await withCache('k', fetcher)).toBe('ok');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});