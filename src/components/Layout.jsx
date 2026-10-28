import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Loader from './Loader';
import ErrorBoundary from './ErrorBoundary';
import ScrollToTop from './ScrollToTop';
import './Layout.scss';

function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="layout">
      <a href="#main" className="skip-link">
        Saltar al contenido
      </a>
      <ScrollToTop />
      <Navbar />
      <main id="main" className="layout__content container" tabIndex={-1}>
        {/* Con key, el boundary se reinicia al cambiar de ruta */}
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;