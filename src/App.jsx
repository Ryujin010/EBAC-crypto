import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Coins from './pages/Coins';
import Watchlist from './pages/Watchlist';
import NotFound from './pages/NotFound';

// El detalle incluye recharts

const CoinDetail = lazy(() => import('./pages/CoinDetail'));

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/coins" element={<Coins />} />
        <Route path="/coins/:id" element={<CoinDetail />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;