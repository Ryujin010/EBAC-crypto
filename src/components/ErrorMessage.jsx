function ErrorMessage({ message, onRetry }) {
  return (
    <div className="alert" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;