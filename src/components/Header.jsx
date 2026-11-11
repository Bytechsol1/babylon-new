import { useEffect, useRef, useState } from 'react';
import logo from '../assets/babylon-logo.png';
import { navigation } from '../content.js';
import { Link, useRouter } from '../router.jsx';

const links = [
  ...navigation.filter(([path]) => path === '/about'),
  ...navigation.filter(([path]) => !['/', '/contact', '/about'].includes(path)),
];
const navSymbols = {
  '/about': <><path d="M16 3C13 9 9 13 9 19a7 7 0 0 0 14 0c0-6-4-10-7-16Z" /><path d="M12 19a4 4 0 0 0 4 4" /></>,
  '/services': <><ellipse cx="16" cy="7" rx="10" ry="3" /><path d="M6 7v4c0 1.7 4.5 3 10 3s10-1.3 10-3V7M6 12v11c0 2 4.5 3.5 10 3.5S26 25 26 23V12M10 17v5M26 18h3v6c0 1.8-5.8 3.5-13 3.5" /></>,
  '/capabilities': <><path d="M12 3h8M14 3v9L7 25c-.8 1.5 0 3 1.8 3h14.4c1.8 0 2.6-1.5 1.8-3l-7-13V3M10 21c4-3 8 3 12 0" /><circle cx="14" cy="17" r=".8" /><circle cx="18" cy="24" r=".8" /></>,
  '/products': <><path d="M4 13h24v15H4zM3 9h26v4H3zM8 9c0-4 6-3 8-6 1 3 8 2 8 6M8 17h16" /></>,
  '/quality': <><path d="m16 3 3.3 2.4 4.1-.1 1.4 3.9 3.4 2.3-1 4 1 4-3.4 2.3-1.4 3.9-4.1-.1L16 28l-3.3-2.4-4.1.1-1.4-3.9L3.8 19.5l1-4-1-4 3.4-2.3 1.4-3.9 4.1.1Z" /><path d="m11 15.5 3.5 3.5 7-7" /></>,
  '/process': <><circle cx="6" cy="16" r="4.5" /><circle cx="16" cy="16" r="4.5" /><circle cx="26" cy="16" r="4.5" /><path d="M10.5 16h1M20.5 16h1" /></>,
  '/faq': <><path d="M16 8C12 5 7 5 3 7v21c4-2 9-2 13 1 4-3 9-3 13-1V7c-4-2-9-2-13 1ZM16 8v21" /></>,
};
function NavIcon({ path }) {
  return <svg className="nav-icon" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">{navSymbols[path]}</svg>;
}
function focusNavigation(element) {
  (element?.querySelector('[aria-current="page"]') || element?.querySelector('a'))?.focus();
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { location } = useRouter();
  const toggle = useRef(null);
  const header = useRef(null);
  const nav = useRef(null);

  useEffect(() => { setMenuOpen(false); }, [location]);
  useEffect(() => {
    if (!menuOpen) return;
    function close(event) {
      if (event.type === 'keydown' && event.key === 'Escape') {
        event.preventDefault(); setMenuOpen(false); toggle.current?.focus();
      }
      if (event.type === 'pointerdown' && !header.current?.contains(event.target)) setMenuOpen(false);
    }
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', close);
    return () => {
      document.removeEventListener('keydown', close);
      document.removeEventListener('pointerdown', close);
    };
  }, [menuOpen]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1101px)');
    function resetMenu(event) {
      if (nav.current?.contains(document.activeElement) && !event.matches) toggle.current?.focus();
      if (document.activeElement === toggle.current && event.matches) focusNavigation(nav.current);
      setMenuOpen(false);
    }
    desktop.addEventListener('change', resetMenu);
    return () => desktop.removeEventListener('change', resetMenu);
  }, []);

  function handleToggleKey(event) {
    if (event.key !== 'ArrowDown') return;
    event.preventDefault(); setMenuOpen(true);
    requestAnimationFrame(() => focusNavigation(nav.current));
  }

  return <header ref={header} className="header" onBlur={event => {
    if (menuOpen && event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false);
  }}>
    <Link className="brand" to="/" aria-label="Babylon home" aria-current={location === '/' ? 'page' : undefined}><img className="brand-logo" src={logo} alt="Babylon" width="181" height="136" /></Link>
    <button ref={toggle} type="button" className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(open => !open)} onKeyDown={handleToggleKey}>
      <span className="menu-toggle-icon" aria-hidden="true"><i /><i /></span><span>{menuOpen ? 'Close' : 'Menu'}</span>
    </button>
    <nav ref={nav} id="main-navigation" className={menuOpen ? 'open' : ''} aria-label="Main navigation">

      <div className="nav-panel-heading" aria-hidden="true"><span>EXPLORE BABYLON</span><span>YOUR VISION. OUR ELEMENT.</span></div>
      <div className="nav-links">{links.map(([path, label]) => <Link key={path} to={path} aria-current={location === path ? 'page' : undefined} onClick={() => setMenuOpen(false)}>
        <NavIcon path={path} /><span className="nav-label">{label}</span><span className="nav-link-indicator" aria-hidden="true">↗</span>
      </Link>)}</div>

    </nav>
    <Link className="header-cta" to="/contact" aria-current={location === '/contact' ? 'page' : undefined} onClick={() => setMenuOpen(false)}>Start a project <span aria-hidden="true"><svg viewBox="0 0 30 24" focusable="false"><path d="M2 12h25m-8-8 8 8-8 8" /></svg></span></Link>
  </header>;
}
