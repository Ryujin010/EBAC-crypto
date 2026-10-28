import { screen, fireEvent } from '@testing-library/react';
import Filters from './Filters';
import { renderWithProviders } from '../utils/testUtils';

describe('Filters', () => {
  it('cambia la moneda de referencia', () => {
    const { store } = renderWithProviders(<Filters />);

    fireEvent.change(screen.getByLabelText(/moneda/i), {
      target: { value: 'mxn' },
    });

    expect(store.getState().coins.vsCurrency).toBe('mxn');
  });

  it('cambia el orden de la lista', () => {
    const { store } = renderWithProviders(<Filters />);

    fireEvent.change(screen.getByLabelText(/ordenar por/i), {
      target: { value: 'volume_desc' },
    });

    expect(store.getState().coins.sortBy).toBe('volume_desc');
  });
});