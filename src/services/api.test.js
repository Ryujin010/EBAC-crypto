import axios from 'axios';
import api, { getErrorMessage } from './api';
import { API_BASE_URL } from '../utils/constants';

describe('api', () => {
  it('usa la URL base de CoinGecko', () => {
    expect(api.defaults.baseURL).toBe(API_BASE_URL);
  });
});

describe('getErrorMessage', () => {
  it('explica el error 429 (límite de peticiones)', () => {
    expect(getErrorMessage({ response: { status: 429 } })).toMatch(
      /demasiadas solicitudes/i,
    );
  });

  it('explica el error 404', () => {
    expect(getErrorMessage({ response: { status: 404 } })).toMatch(
      /no se encontró/i,
    );
  });

  it('explica los errores de servidor (5xx)', () => {
    expect(getErrorMessage({ response: { status: 503 } })).toMatch(
      /no está disponible/i,
    );
  });

  it('incluye el código en otros errores HTTP', () => {
    expect(getErrorMessage({ response: { status: 400 } })).toBe(
      'Error 400 al consultar la API.',
    );
  });

  it('detecta el timeout', () => {
    expect(getErrorMessage({ code: 'ECONNABORTED' })).toMatch(/tardó demasiado/i);
  });

  it('detecta la falta de conexión', () => {
    expect(getErrorMessage({ request: {} })).toMatch(/no hay conexión/i);
  });

  it('detecta una solicitud cancelada', () => {
    expect(getErrorMessage(new axios.CanceledError('cancelado'))).toMatch(
      /cancelada/i,
    );
  });

  it('usa el mensaje del error cuando no hay otra información', () => {
    expect(getErrorMessage(new Error('algo raro'))).toBe('algo raro');
  });
});