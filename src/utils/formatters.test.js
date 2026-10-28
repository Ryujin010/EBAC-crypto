import {
  formatCurrency,
  formatCompact,
  formatNumber,
  formatPercent,
  changeClass,
  stripHtml,
} from './formatters';

describe('formatCurrency', () => {
  it('formatea precios normales con dos decimales', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50');
    expect(formatCurrency(0.5)).toBe('$0.50');
  });

  it('muestra más decimales en monedas muy baratas', () => {
    expect(formatCurrency(0.000123)).toBe('$0.000123');
  });

  it('respeta la moneda indicada', () => {
    expect(formatCurrency(1234.5, 'eur')).toBe('€1,234.50');
  });

  it('devuelve un guion si no hay valor', () => {
    expect(formatCurrency(null)).toBe('—');
    expect(formatCurrency(undefined)).toBe('—');
  });
});

describe('formatCompact y formatNumber', () => {
  it('abrevia cantidades grandes', () => {
    expect(formatCompact(2500000000)).toBe('$2.5B');
    expect(formatCompact(1234567)).toBe('$1.23M');
    expect(formatNumber(19700000)).toBe('19.7M');
  });

  it('devuelve un guion si no hay valor', () => {
    expect(formatCompact(null)).toBe('—');
    expect(formatNumber(undefined)).toBe('—');
  });
});

describe('formatPercent y changeClass', () => {
  it('agrega el signo + a los positivos', () => {
    expect(formatPercent(2.5)).toBe('+2.50%');
  });

  it('mantiene el signo de los negativos', () => {
    expect(formatPercent(-1.234)).toBe('-1.23%');
  });

  it('formatea el cero y los valores vacíos', () => {
    expect(formatPercent(0)).toBe('0.00%');
    expect(formatPercent(null)).toBe('—');
  });

  it('elige la clase según el signo', () => {
    expect(changeClass(3)).toBe('up');
    expect(changeClass(-3)).toBe('down');
    expect(changeClass(0)).toBe('muted');
    expect(changeClass(null)).toBe('muted');
  });
});

describe('stripHtml', () => {
  it('quita las etiquetas y deja el texto', () => {
    expect(stripHtml('<a href="https://x.com">Bitcoin</a> es <b>digital</b>')).toBe(
      'Bitcoin es digital',
    );
  });

  it('devuelve una cadena vacía si no hay texto', () => {
    expect(stripHtml()).toBe('');
  });
});