import { useEffect } from 'react';

const APP_NAME = 'Crypto Tracker';

// Actualiza el título de la pestaña del navegador

function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;
  }, [title]);
}

export default useDocumentTitle;