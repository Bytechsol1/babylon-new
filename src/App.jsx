import { useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import ProcessStrip from './components/ProcessStrip.jsx';
import ChemistrySection from './components/ChemistrySection.jsx';
import InfoDialog from './components/InfoDialog.jsx';

export default function App() {
  const [panel, setPanel] = useState(null);
  return <>
    <Header onOpen={setPanel} />
    <main>
      <Hero onOpen={setPanel} />
      <ProcessStrip onOpen={setPanel} />
      <ChemistrySection onOpen={setPanel} />

    </main>
    <InfoDialog panel={panel} onOpen={setPanel} onClose={() => setPanel(null)} />
  </>;
}
