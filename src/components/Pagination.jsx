function Pagination({ page, hasNext, onPageChange }) {
  return (
    <nav className="pagination" aria-label="Paginación">
      <button
        type="button"
        className="btn"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        ← Anterior
      </button>
      <span aria-current="page">Página {page}</span>
      <button
        type="button"
        className="btn"
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
      >
        Siguiente →
      </button>
    </nav>
  );
}

export default Pagination;