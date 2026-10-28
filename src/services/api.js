import axios from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: { Accept: 'application/json' },
});

// Convierte cualquier error de Axios en un mensaje claro para el usuario

export const getErrorMessage = (error) => {
  if (axios.isCancel(error)) return 'Solicitud cancelada.';
  if (error?.code === 'ECONNABORTED') {
    return 'La solicitud tardó demasiado. Intenta de nuevo.';
  }
  if (error?.response) {
    const { status } = error.response;
    if (status === 429) {
      return 'Demasiadas solicitudes a la API. Espera un minuto e intenta de nuevo.';
    }
    if (status === 404) return 'No se encontró el recurso solicitado.';
    if (status >= 500) {
      return 'El servidor de CoinGecko no está disponible por ahora.';
    }
    return `Error ${status} al consultar la API.`;
  }
  if (error?.request) {
    return 'No hay conexión con el servidor. Revisa tu internet.';
  }
  return error?.message || 'Ocurrió un error inesperado.';
};

export default api;