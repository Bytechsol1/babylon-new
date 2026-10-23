import { useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import InfoDialog from './components/InfoDialog.jsx';

export default function App() {
  const [panel, setPanel] = useState(null);
  return <>
    <Header onOpen={setPanel} />
    <main>
      <Hero onOpen={setPanel} />
    <section className="credentials" aria-label="Our approach"><span className="credentials-intro">CREATIVITY, MEET<br />CREDIBILITY.</span><span>Purposeful formulations</span><span className="tiny-star" aria-hidden="true">✳</span><span>Precision at every step</span><span className="tiny-star" aria-hidden="true">✳</span><span>From concept to creation</span><span className="tiny-star" aria-hidden="true">✳</span><span>Your vision. Your formula.</span></section>
    <footer className="page-footer"><span>INDEPENDENT THINKING. EXTRAORDINARY POSSIBILITIES.</span><span>SCIENCE IS ONLY THE BEGINNING. <span aria-hidden="true">↗</span></span></footer>

    </main>
    <InfoDialog panel={panel} onOpen={setPanel} onClose={() => setPanel(null)} />
  </>;
}
