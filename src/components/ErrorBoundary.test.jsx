import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

let shouldThrow = true;

function Flaky() {
  if (shouldThrow) throw new Error('boom');
  return <p>Todo bien</p>;
}

describe('ErrorBoundary', () => {
  let consoleError;

  beforeEach(() => {
    shouldThrow = true;

    // React y el boundary escriben el error en consola: lo silenciamos en la prueba
   
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it('muestra a los hijos cuando no hay errores', () => {
    shouldThrow = false;
    render(
      <ErrorBoundary>
        <Flaky />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Todo bien')).toBeInTheDocument();
  });

  it('muestra un mensaje de error si un hijo falla', () => {
    render(
      <ErrorBoundary>
        <Flaky />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(/algo salió mal/i);
  });

  it('permite reintentar y recupera la página', () => {
    render(
      <ErrorBoundary>
        <Flaky />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();

    shouldThrow = false;
    fireEvent.click(screen.getByRole('button', { name: /reintentar/i }));

    expect(screen.getByText('Todo bien')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});