import { useState } from 'react';
import logo from '../assets/babylon-logo.png';

const navigation = [
  { panel: 'science', label: 'The science' },
  { panel: 'lab', label: 'The lab' },
  { panel: 'process', label: 'The process' },
  { panel: 'practice', label: 'In practice' },
];

export default function Header({ onOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [highlight, setHighlight] = useState({ left: 0, width: 0, visible: false });

  function highlightLink(event) {
    const link = event.currentTarget;
    setHighlight({ left: link.offsetLeft, width: link.offsetWidth, visible: true });
  }
  function hideHighlight() {
    setHighlight(previous => ({ ...previous, visible: false }));
  }
  function openPanel(panel) {
    setMenuOpen(false);
    hideHighlight();
    onOpen(panel);
  }

  return (
  <header className="header">
    <a className="brand" href="#" aria-label="Babylon home">
      <img className="brand-logo" src={logo} alt="Babylon" width="181" height="136" />
    </a>
    <nav
      id="main-navigation"
      className={menuOpen ? 'open' : ''}
      aria-label="Main navigation"
      onPointerLeave={event => { if (!event.currentTarget.contains(document.activeElement)) hideHighlight(); }}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) hideHighlight(); }}
    >
      <span
        className="nav-highlight"
        aria-hidden="true"
        style={{ width: highlight.width, transform: `translateX(${highlight.left}px)`, opacity: highlight.visible ? 1 : 0 }}
      />
      {navigation.map(item => (
        <button key={item.panel} data-panel={item.panel} onClick={() => openPanel(item.panel)} onPointerEnter={highlightLink} onFocus={highlightLink}>
          <span className="nav-link-dot" aria-hidden="true" />
          {item.label}
        </button>
      ))}
    </nav>
    <button className="header-cta" data-panel="project" onClick={() => openPanel("project")}>Start a project <span aria-hidden="true">↗</span></button>
    <button className="menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(open => !open)}><span></span><span></span></button>
  </header>


  );
}
