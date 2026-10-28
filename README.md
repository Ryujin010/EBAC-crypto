# 🪙 Crypto Tracker

Aplicación web para consultar precios, gráficas y tendencias de criptomonedas, y guardar tus favoritas en una watchlist.

🔗 **Sitio publicado:** _pega aquí tu enlace de Netlify_

## Funcionalidades

- **Dashboard:** top 5 por capitalización y monedas en tendencia.
- **Monedas:** tabla con búsqueda (con debounce), orden, moneda de referencia (USD, MXN, EUR) y paginación.
- **Detalle:** estadísticas de mercado y gráfica de precios (24h, 7d, 30d, 90d).
- **Watchlist:** monedas favoritas guardadas en `localStorage`.
- Diseño responsivo (móvil, tablet y escritorio) y accesible.

## Tecnologías

- **React** (componentes funcionales y hooks) y **react-router-dom**
- **Redux Toolkit** (slices, `createAsyncThunk` y selectores)
- **Axios** (instancia configurada, caché y cancelación de peticiones)
- **SASS** (variables, mixins y enfoque mobile-first)
- **Recharts** (gráficas)
- **Jest** y **React Testing Library** (pruebas)
- **Vite** (herramienta de compilación)
- API pública: [CoinGecko](https://www.coingecko.com/en/api)

## Cómo ejecutarlo

```bash
git clone <URL-DE-TU-REPOSITORIO>
cd <carpeta-del-repositorio>
npm install
npm run dev
```

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación para producción |
| `npm run preview` | Vista previa de la compilación |
| `npm test` | Ejecuta las pruebas |
| `npm run test:coverage` | Pruebas con reporte de cobertura |
| `npm run lint` | Revisa el código con ESLint |

## Estructura

src/
├── app/ store de Redux
├── features/ slices (coins, watchlist)
├── services/ Axios, caché y llamadas a la API
├── components/ componentes reutilizables
├── pages/ una página por ruta
├── hooks/ custom hooks
├── styles/ SASS (variables, mixins, estilos globales)
└── utils/ formateadores, almacenamiento y constantes

## Notas

La API gratuita de CoinGecko tiene límite de peticiones por minuto. Si aparece el aviso de "Demasiadas solicitudes", espera un minuto y pulsa **Reintentar**.