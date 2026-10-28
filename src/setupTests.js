import { TextEncoder, TextDecoder } from 'node:util';
import '@testing-library/jest-dom';

// jsdom no incluye estas APIs y react-router las necesita

globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;

// jsdom no implementa window.scrollTo (ScrollToTop lo usa al navegar)

window.scrollTo = jest.fn();