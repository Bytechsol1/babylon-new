import { useState } from 'react';

export default function Header({ onOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  function openPanel(panel) { setMenuOpen(false); onOpen(panel); }
  return <>
  <div className="announcement"><span><i /> PRECISION SCIENCE. UNCONVENTIONAL THINKING.</span><button data-panel="project" onClick={() => openPanel("project")}>Let’s talk chemistry <span aria-hidden="true">↗</span></button></div>
  <header className="header">
    <a className="brand" href="#" aria-label="Babylon home">
      <svg className="brand-mark" viewBox="0 0 96 67" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1.3"><path d="M12 61V8h23v53M61 61V8h23v53M10 8V3h5v3h5V3h5v3h5V3h6v5M60 8V3h5v3h5V3h5v3h5V3h5v5M35 20h26M35 25h26M35 61V42a13 13 0 0 1 26 0v19M41 61V43a7 7 0 0 1 14 0v18M8 62h80M17 15h5v5h-5zM26 15h5v5h-5zM17 27h5v5h-5zM26 27h5v5h-5zM17 39h5v5h-5zM26 39h5v5h-5zM17 51h5v5h-5zM26 51h5v5h-5zM66 15h5v5h-5zM75 15h5v5h-5zM66 27h5v5h-5zM75 27h5v5h-5zM66 39h5v5h-5zM75 39h5v5h-5zM66 51h5v5h-5zM75 51h5v5h-5z"/></g></svg>
      <span>BABYLON</span>
    </a>
    <nav className={menuOpen ? "open" : ""} aria-label="Main navigation"><button data-panel="science" onClick={() => openPanel("science")}>The science</button><button data-panel="lab" onClick={() => openPanel("lab")}>The lab</button><button data-panel="process" onClick={() => openPanel("process")}>The process</button><button data-panel="practice" onClick={() => openPanel("practice")}>In practice</button></nav>
    <button className="button header-cta" data-panel="project" onClick={() => openPanel("project")}>Start a project <span aria-hidden="true">↗</span></button>
    <button className="menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(open => !open)}><span></span><span></span></button>
  </header>


  </>;
}
