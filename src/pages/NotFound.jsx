import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

function NotFound() {
  useDocumentTitle('Página no encontrada');

  return (
    <section className="page">
      <h1>404</h1>
      <p className="muted">La página que buscas no existe.</p>
      <Link to="/" className="up">
        Volver al inicio
      </Link>
    </section>
  );
}

export default NotFound;