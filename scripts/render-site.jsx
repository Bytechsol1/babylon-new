import { renderToString } from 'react-dom/server';
import App from '../src/App.jsx';

// Build-time only, never a request handler. Effects, providers and network calls
// do not run. The read-only facade lets existing browser-only initializers render
// without changing the inquiry form or chatbot implementations.
export function renderPage(path) {
  const previous = globalThis.window;
  const previousFetch = globalThis.fetch;
  globalThis.window = { location: { pathname: path, search: '', hash: '', origin: 'http://static-build.invalid' }, matchMedia: () => ({ matches: false }) };
  globalThis.fetch = () => { throw new Error('Network requests are not allowed during static page rendering.'); };
  try { return renderToString(<App />); }
  finally { globalThis.fetch = previousFetch; if (previous === undefined) delete globalThis.window; else globalThis.window = previous; }
}
