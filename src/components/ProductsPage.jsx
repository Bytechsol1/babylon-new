import { confirmedProductFormats, confirmedProductCategories } from '../productContent.js';
import { Link } from '../router.jsx';
import PageReview from './PageReview.jsx';
import { editorialImages } from '../editorialImages.js';
import '../products.css';
import styles from './ProductsImagery.module.css';

const overview = editorialImages['products-hero'];
const number = index => String(index + 1).padStart(2, '0');
const categoryImages = {
  skincare: editorialImages['products-skincare'],
  'personal-care': editorialImages['products-personal-care'],
};

function Label({ number: index, children, aside = '' }) {
  return <div className="section-label"><span>{children}</span><i aria-hidden="true" /><span>{aside}</span></div>;
}

export default function ProductsPage() {
  return <div className="prod-page">
    <section className="prod-hero content-width" aria-labelledby="products-page-title">
      <Label number="03">WHAT WE MAKE</Label>
      <div className="prod-hero-heading"><h1 id="products-page-title">What we <em>make</em></h1><div><span className="kicker">SKINCARE AND PERSONAL CARE</span><p>We formulate, manufacture and fill cosmetics for skincare and personal-care brands.</p><Link className="prod-text-link" to="/contact">Start a product inquiry<span aria-hidden="true">→</span></Link></div></div>
      <figure className="prod-hero-figure" data-product-concept="overview"><img src={overview.src} srcSet={`${overview.small} 600w, ${overview.src} 1200w`} sizes="(max-width: 1511px) 90vw, 1360px" alt={overview.alt} width="1200" height="800" fetchPriority="high" /><figcaption><span>COSMETIC TEXTURE STUDY</span><span>AI-GENERATED CONCEPT</span></figcaption></figure>
      <nav className="prod-topic-nav" aria-label="Product categories and inquiry">{confirmedProductCategories.map((category, index) => <a key={category.id} href={`#${category.id}`}><span>{number(index)}</span>{category.name}<span aria-hidden="true">→</span></a>)}<Link to="/contact#product-brief-guidance"><span>03</span>Product inquiry<span aria-hidden="true">→</span></Link></nav>
    </section>

    <section className="prod-discovery content-width" aria-labelledby="product-categories-title">
      <Label number="01" aside="FORMULATION · MANUFACTURING · FILLING">PRODUCT CATEGORIES</Label>
      <div className="prod-discovery-heading"><h2 id="product-categories-title">Skincare and<br /><em>personal care</em></h2><p>We develop from a product brief or work with an existing formula.</p></div>
      <div className={`prod-approved ${styles.categories}`}>{confirmedProductCategories.map((category, index) => <article className={styles.category} id={category.id} key={category.id} aria-labelledby={`${category.id}-title`}>
        <figure className={styles.image} data-product-concept={category.id}><img src={categoryImages[category.id].src} srcSet={`${categoryImages[category.id].small} 600w, ${categoryImages[category.id].src} 1200w`} sizes="(max-width: 700px) 90vw, 200px" alt={categoryImages[category.id].alt} width="1200" height="800" loading="lazy" decoding="async" /><figcaption><span>{number(index)}</span><span>AI-GENERATED CONCEPT</span></figcaption></figure><div><h3 id={`${category.id}-title`}>{category.name}</h3><p>{category.description}</p></div><Link className="prod-text-link" to={`/contact?question=${encodeURIComponent(category.question)}`}>Ask about {category.name.toLowerCase()}<span aria-hidden="true">→</span></Link>
      </article>)}</div>
    </section>

    {confirmedProductFormats.length > 0 && <section className="prod-approved content-width" aria-labelledby="approved-formats-title"><Label number="02">PRODUCT FORMATS</Label><h2 id="approved-formats-title">Product formats</h2>{confirmedProductFormats.map((format, index) => <article key={format.name}><span className="kicker">{number(index)}</span><div><h3>{format.name}</h3><p>{format.description}</p></div><Link className="prod-text-link" to={`/contact?product=${encodeURIComponent(format.name)}`}>Ask about this format<span aria-hidden="true">→</span></Link></article>)}</section>}

    <section className="prod-invitation content-width" aria-labelledby="product-next-title"><div><span className="kicker">YOUR PRODUCT</span><h2 id="product-next-title">Have a product<br /><em>in mind?</em></h2></div><div className="prod-invitation-actions"><Link className="prod-primary-cta" to="/contact">Start a product inquiry<span aria-hidden="true">→</span></Link></div></section>
    <PageReview page="products" />
  </div>;
}
