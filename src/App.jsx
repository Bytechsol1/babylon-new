import { useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import OriginalHero from './components/OriginalHero.jsx';
import ProcessStrip from './components/ProcessStrip.jsx';
import ChemistrySection from './components/ChemistrySection.jsx';
import ManufacturingSection from './components/ManufacturingSection.jsx';
import InfoDialog from './components/InfoDialog.jsx';
import { TestimonialsSection, ContactSection, FAQSection, SiteFooter } from './components/ClosingSections.jsx';

export default function App() {
  const [panel, setPanel] = useState(null);
  function openPanel(nextPanel) {
    if (nextPanel === 'project') {
      setPanel(null);
      requestAnimationFrame(() => {
        document.querySelector('#contact')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
        document.querySelector('#contact-title')?.focus({ preventScroll: true });
      });
    } else setPanel(nextPanel);
  }
  return <>
    <Header onOpen={openPanel} />
    <main>
      <div className="opening-section">
        <OriginalHero onOpen={openPanel} />
        <ProcessStrip onOpen={openPanel} />
      </div>
      <ChemistrySection onOpen={openPanel} />
      <Hero />
      <ManufacturingSection />
      <TestimonialsSection />
      <ContactSection />
      <FAQSection />
    </main>
    <SiteFooter />
    <InfoDialog panel={panel} onOpen={openPanel} onClose={() => setPanel(null)} />
  </>;
}
