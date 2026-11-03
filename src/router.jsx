import { createContext, useContext, useEffect, useState } from 'react';
const RouterContext = createContext(null);
export function Router({ children }) {
  const [location, setLocation] = useState(() => window.location.pathname.replace(/\/$/, '') || '/');
  useEffect(() => {
    const update = () => setLocation(window.location.pathname.replace(/\/$/, '') || '/');
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);
  function navigate(to) {
    const destination = new URL(to, window.location.origin);
    if (destination.origin !== window.location.origin) return;
    window.history.pushState({}, '', destination.pathname + destination.search + destination.hash);
    setLocation(destination.pathname.replace(/\/$/, '') || '/');
    requestAnimationFrame(() => {
      const anchor = destination.hash ? document.getElementById(destination.hash.slice(1)) : null;
      if (anchor) anchor.scrollIntoView();
      else window.scrollTo({ top: 0, behavior: 'instant' });
      document.querySelector('main')?.focus({ preventScroll: true });
    });
  }
  return <RouterContext.Provider value={{ location, navigate }}>{children}</RouterContext.Provider>;
}
export const useRouter = () => useContext(RouterContext);
export function Link({ to, onClick, children, ...props }) {
  const { navigate } = useRouter();
  return <a href={to} {...props} onClick={event => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target || props.download) return;
    event.preventDefault(); navigate(to);
  }}>{children}</a>;
}
