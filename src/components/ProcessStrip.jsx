const steps = [
  { number: '01', title: 'Formulate', description: 'Transform ideas into tailored formulas.' },
  { number: '02', title: 'Refine', description: 'Perfect performance, texture and stability.' },
  { number: '03', title: 'Scale', description: 'Move to production with confidence.' },
];

export default function ProcessStrip({ onOpen }) {
  return (
    <section className="process-strip" aria-label="From molecule to market">
      <p className="process-tagline">FROM MOLECULE TO MARKET.</p>
      <ol>
        {steps.map(step => (
          <li key={step.number}>
            <span className="process-number" aria-hidden="true">{step.number}</span>
            <div>
              <button onClick={() => onOpen('process')}>{step.title}</button>
              <p>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
