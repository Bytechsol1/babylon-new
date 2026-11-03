import { confirmedProductFormats, productBriefStudies } from '../productContent.js';
import { Link } from '../router.jsx';
import PageReview from './PageReview.jsx';
import heroImage from '../assets/products/product-hero.webp';
import heroSmall from '../assets/products/product-hero-small.webp';
import useImage from '../assets/products/intended-use.webp';
import textureImage from '../assets/products/texture-application.webp';
import packagingImage from '../assets/products/packaging-markets.webp';
import '../products.css';

const studyImages = [
  { src: useImage, alt: 'Illustrative close-up of a dropper applying a cosmetic sample to the back of a hand.', caption: 'APPLICATION STUDY' },
  { src: textureImage, alt: 'Illustrative cream, milky fluid and clear gel swatches on a glass plate.', caption: 'TEXTURE STUDY' },
  { src: packagingImage, alt: 'Illustrative unbranded jar, dropper and pump packaging with a metal caliper.', caption: 'PACKAGING STUDY' },
];
const number = index => String(index + 1).padStart(2, '0');

function Label({ number: index, children, aside = 'YOUR VISION. OUR ELEMENT.' }) {
  return <div className="section-label"><span>{index} / {children}</span><i aria-hidden="true" /><span>{aside}</span></div>;
}

export default function ProductsPage() {
  return <div className="prod-page">
    <section className="prod-hero content-width" aria-labelledby="products-page-title">
      <Label number="03">PRODUCT FORMATS</Label>
      <div className="prod-hero-heading"><h1 id="products-page-title">A format for<em>your imagination.</em></h1><div><span className="kicker">START WITH THE PRODUCT YOU WANT TO CREATE</span><p>Describe the format, desired feel, and intended use. Discuss suitability and manufacturing scope with Babylon before planning production.</p><Link className="prod-text-link" to="/contact">Discuss your product<span aria-hidden="true">↗</span></Link></div></div>
      <figure className="prod-hero-figure"><img src={heroImage} srcSet={`${heroSmall} 720w, ${heroImage} 1440w`} sizes="(max-width: 700px) 90vw, (max-width: 1511px) 90vw, 1360px" alt="Illustrative unbranded dropper, cream jar and pump bottle on stone plinths against an ivory and navy backdrop." width="1440" height="960" fetchPriority="high" /><figcaption><span>FORM. FEEL. POSSIBILITY.</span><span>ILLUSTRATIVE CONCEPT IMAGERY</span></figcaption></figure>
      <nav className="prod-topic-nav" aria-label="Explore your product brief">{productBriefStudies.map((study, index) => <a key={study.id} href={`#${study.id}`}><span>{number(index)}</span>{study.title}<span aria-hidden="true">↓</span></a>)}</nav>
    </section>

    <section className="prod-discovery content-width" aria-labelledby="product-brief-title">
      <Label number="01" aside="A BRIEF, IN THREE PARTS">YOUR STARTING POINT</Label>
      <div className="prod-discovery-heading"><h2 id="product-brief-title">Your product.<br /><em>A clear starting point.</em></h2><div><p>Have an existing formula or a new idea? Outline what you want the product to do, how it should feel, and how it will be used.</p><p>The next conversation is about the format, materials, packaging, and development work your project may need.</p></div></div>
      <div className="prod-studies">{productBriefStudies.map((study, index) => <article className={`prod-study prod-study-${index}`} id={study.id} key={study.id} aria-labelledby={`${study.id}-title`}>
        <figure><div className="prod-study-photo"><img src={studyImages[index].src} alt={studyImages[index].alt} width="900" height="900" loading="lazy" decoding="async" /><span className="prod-study-index" aria-hidden="true">{number(index)}</span></div><figcaption><span>{studyImages[index].caption}</span><span>ILLUSTRATIVE STUDY</span></figcaption></figure>
        <div className="prod-study-copy"><h3 id={`${study.id}-title`}>{study.title}</h3><p>{study.text}</p><Link className="prod-text-link" to={`/contact?question=${encodeURIComponent(study.question)}`}>Discuss {study.title.toLowerCase()}<span aria-hidden="true">↗</span></Link></div>
      </article>)}</div>
    </section>

    {confirmedProductFormats.length > 0 && <section className="prod-approved content-width" aria-labelledby="approved-formats-title"><Label number="02">PRODUCT FORMATS</Label><h2 id="approved-formats-title">Explore the formats.</h2>{confirmedProductFormats.map((format, index) => <article key={format.name}><span className="kicker">{number(index)}</span><div><h3>{format.name}</h3><p>{format.description}</p></div><Link className="prod-text-link" to={`/contact?product=${encodeURIComponent(format.name)}`}>Discuss this format<span aria-hidden="true">↗</span></Link></article>)}</section>}

    <section className="prod-invitation content-width" aria-labelledby="product-next-title"><div><span className="kicker">LET’S MAKE A BEGINNING</span><h2 id="product-next-title">An idea in mind?<br /><em>Let’s talk about it.</em></h2></div><div className="prod-invitation-actions"><Link className="prod-primary-cta" to="/contact">Discuss your product<span aria-hidden="true">↗</span></Link><Link className="prod-service-link" to="/services">Explore the ways to work together<span aria-hidden="true">→</span></Link></div></section>
    <PageReview page="products" />
  </div>;
}
