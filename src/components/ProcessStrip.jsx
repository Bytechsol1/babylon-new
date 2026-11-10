import { company, certification, certificationVisible } from '../content.js';

export default function ProcessStrip({ onOpen }) {
  const steps = [
    { number: '01', title: `Founded ${company.founded}`, description: 'San Jose, California', destination: 'about' },
    certificationVisible() && { number: '02', title: certification.standard, description: `Certified through ${certification.heldThroughYear}`, destination: 'quality' },
    { number: '03', title: 'Lot traceability', description: 'Manufacturing execution system', destination: 'about' },
  ].filter(Boolean);
  return (
    <section className="process-strip" aria-label="Confirmed company facts">
      <p className="process-tagline">COMPANY FACTS</p>
      <ol>
        {steps.map(step => (
          <li key={step.number}>
            <div>
              <button onClick={() => onOpen(step.destination)}>{step.title}<span aria-hidden="true"> →</span></button>
              <p>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
