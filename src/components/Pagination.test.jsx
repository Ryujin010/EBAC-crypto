import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination', () => {
  it('deshabilita "Anterior" en la primera página', () => {
    render(<Pagination page={1} hasNext onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: /anterior/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /siguiente/i })).toBeEnabled();
  });

  it('deshabilita "Siguiente" cuando no hay más páginas', () => {
    render(<Pagination page={3} hasNext={false} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: /siguiente/i })).toBeDisabled();
  });

  it('llama a onPageChange con la página correcta', () => {
    const onPageChange = jest.fn();
    render(<Pagination page={2} hasNext onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole('button', { name: /anterior/i }));
    expect(onPageChange).toHaveBeenLastCalledWith(1);

    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);
  });

  it('muestra la página actual', () => {
    render(<Pagination page={4} hasNext onPageChange={() => {}} />);
    expect(screen.getByText('Página 4')).toBeInTheDocument();
  });
});