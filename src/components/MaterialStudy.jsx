import { useId, useState } from 'react';
import heroReference from '../assets/hero-reference-clean.webp';

const stages = [
  { number: '01', name: 'Formulate', offset: '4%' },
  { number: '02', name: 'Refine', offset: '37.333%' },
  { number: '03', name: 'Scale', offset: '70.666%' },
];

export default function MaterialStudy({ onOpen }) {
  const orbitPathId = useId();
  const [paused, setPaused] = useState(false);

  return (
    <div className="hero-visual">
      <svg className="orbit-map" viewBox="0 0 600 600" aria-hidden="true">
        <circle cx="300" cy="300" r="294" />
      </svg>
      <div className="circular-photo">
        <img src={heroReference} alt="Amber serum and laboratory glassware against a navy arch, with stone plinths and a soft cream formulation." width="1676" height="939" fetchPriority="high" />
      </div>
      <div className="orbit-window">
        <svg className={`orbit-system${paused ? ' is-paused' : ''}`} viewBox="0 0 600 600" role="group" aria-label="Our process, from formulation to scale">
          <defs>
            <path id={orbitPathId} d="M300 28a272 272 0 1 1 0 544a272 272 0 1 1 0-544" />
          </defs>
          {stages.map(stage => (
            <a key={stage.number} className="orbit-label" href="#process" onClick={event => { event.preventDefault(); onOpen('process'); }} aria-label={`${stage.number}: ${stage.name.toLowerCase()}`}>
              <text className="orbit-type">
                <textPath href={`#${orbitPathId}`} startOffset={stage.offset}>
                  <tspan className="orbit-number">{stage.number}</tspan>
                  <tspan className="orbit-name" dx="11">{stage.name.toUpperCase()}</tspan>
                  <tspan className="orbit-separator" dx="19">•</tspan>
                </textPath>
              </text>
            </a>
          ))}
        </svg>
      </div>
      <div className="hero-image-controls"><span>ILLUSTRATIVE PRODUCT STUDY</span><button type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? 'Play orbit' : 'Pause orbit'} <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span></button></div>
    </div>
  );
}
