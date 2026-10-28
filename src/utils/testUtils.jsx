import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { setupStore } from '../app/store';

// Renderiza un componente con Redux y Router, igual que en la app real

export function renderWithProviders(
  ui,
  { preloadedState, store = setupStore(preloadedState), route = '/' } = {},
) {
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </Provider>,
    ),
  };
}