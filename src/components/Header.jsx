import { useEffect, useRef, useState } from 'react';
import logo from '../assets/babylon-logo.png';
import { navigation } from '../content.js';
import { Link, useRouter } from '../router.jsx';

const links = [
  ...navigation.filter(([path]) => path === '/about'),
  ...navigation.filter(([path]) => !['/', '/contact', '/about'].includes(path)),
];
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

      <div className="nav-panel-heading" aria-hidden="true"><span>MENU</span><span>SAN JOSE · SINCE 2016</span></div>
      <div className="nav-links">{links.map(([path, label]) => <Link key={path} to={path} aria-current={location === path ? 'page' : undefined} onClick={() => setMenuOpen(false)}>
        <span className="nav-label">{label}</span><span className="nav-link-indicator" aria-hidden="true">→</span>
      </Link>)}</div>

    </nav>
    <Link className="header-cta" to="/contact" aria-current={location === '/contact' ? 'page' : undefined} onClick={() => setMenuOpen(false)}>Start a project <span aria-hidden="true"><svg viewBox="0 0 30 24" focusable="false"><path d="M2 12h25m-8-8 8 8-8 8" /></svg></span></Link>
  </header>;
}
