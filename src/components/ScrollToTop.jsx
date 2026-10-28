import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Al cambiar de ruta, la página vuelve al inicio

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;