import heroReference from '../assets/hero-reference-clean.webp';

export default function MaterialStudy() {
  return (
    <div className="hero-visual">
      <div className="circular-photo">
        <img src={heroReference} alt="Amber serum and laboratory glassware against a navy arch, with stone plinths and a soft cream formulation." width="1676" height="939" fetchPriority="high" decoding="async" />
      </div>
    </div>
  );
}
