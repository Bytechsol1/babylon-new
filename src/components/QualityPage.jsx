import { certification, certificationVisible } from '../content.js';
import { qualityReviewRows, qualityRecordTopics } from '../qualityContent.js';
import { Link } from '../router.jsx';
import PageReview from './PageReview.jsx';
import { editorialImages } from '../editorialImages.js';
import '../quality.css';
import styles from './QualityTable.module.css';

const heroImage = editorialImages['quality-hero'];
const recordsImage = editorialImages['quality-records'];
const number = index => String(index + 1).padStart(2, '0');
function Label({ number: index, children, aside = '' }) {
  return <div className="section-label"><span>{children}</span><i aria-hidden="true" /><span>{aside}</span></div>;
}

export default function QualityPage() {
  const showCertificate = certificationVisible();
  return <div className="qlt-page">
    <section className="qlt-hero content-width" aria-labelledby="quality-page-title">
      <Label number="04">QUALITY</Label>
      <div className="qlt-hero-grid"><div className="qlt-hero-copy"><span className="kicker">COSMETICS GMP AND PRODUCTION RECORDS</span><h1 id="quality-page-title">Quality checks<em>and traceability</em></h1><p className="qlt-hero-lead">Quality methods assess products against their specifications.</p><a className="qlt-text-link" href="#quality-topics">See the quality methods<span aria-hidden="true">→</span></a></div>
        <figure className="qlt-hero-image"><img src={heroImage.src} srcSet={`${heroImage.small} 600w, ${heroImage.src} 1000w`} sizes="(max-width: 700px) 88vw, (max-width: 1511px) 44vw, 620px" alt={heroImage.alt} width="1000" height="1000" fetchPriority="high" /><figcaption className={styles.imageCaption}><span>SAMPLE-HANDLING ILLUSTRATION</span><span>AI-GENERATED CONCEPT</span></figcaption></figure>
      </div>
    </section>

    <section className={`qlt-standard content-width${showCertificate ? '' : ' qlt-standard-neutral'}`} aria-labelledby="quality-standard-title"><div className="qlt-standard-title"><span className="kicker">QUALITY INFORMATION</span><h2 id="quality-standard-title">Cosmetics GMP<br /><em>certification</em></h2></div>
      {showCertificate && <div className="qlt-certification"><span className="kicker">COSMETICS · GOOD MANUFACTURING PRACTICES</span><strong>{certification.standard}</strong><p>We hold {certification.standard} certification through {certification.heldThroughYear}.</p></div>}
      <div className="qlt-standard-copy"><p>For certification or project-specific quality questions, contact us.</p><Link className="qlt-text-link" to="/contact">Send a quality question<span aria-hidden="true">→</span></Link></div>
    </section>

    <section className="qlt-testing content-width" id="quality-topics" aria-labelledby="quality-testing-title"><Label number="01" aside="SPECIFICATIONS AND REVIEW">TESTING OVERVIEW</Label><div className="qlt-section-heading"><h2 id="quality-testing-title">Quality methods<br /><em>and project scope</em></h2></div>
      <div className="qlt-scope-note"><span className="kicker">PROJECT-SPECIFIC SCOPE</span><p id="quality-testing-scope">This overview describes QC specification review. It does not establish a testing location or confirm that a test is included in a project.</p></div>
      <table className={styles.table} role="table" aria-describedby="quality-testing-scope">
        <caption className="visually-hidden">Quality control method, location and project inclusion</caption>
        <thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">Test</th><th scope="col" role="columnheader">What it checks</th><th scope="col" role="columnheader">Where it is performed</th><th scope="col" role="columnheader">Whether it is included in a project</th></tr></thead>
        <tbody role="rowgroup">{qualityReviewRows.map(row => <tr role="row" key={row.test}><th scope="row" role="rowheader"><span className={styles.cellLabel} aria-hidden="true">Test</span>{row.test}</th><td role="cell"><span className={styles.cellLabel} aria-hidden="true">What it checks</span>{row.checks}</td><td role="cell"><span className={styles.cellLabel} aria-hidden="true">Where it is performed</span>{row.location || 'Not confirmed'}</td><td role="cell"><span className={styles.cellLabel} aria-hidden="true">Whether it is included in a project</span>{row.included || 'Not confirmed'}</td></tr>)}</tbody>
      </table>
    </section>

    <section className="qlt-records content-width" aria-labelledby="quality-records-title"><Label number="02" aside="A REFERENCE FOR THE PROJECT">DOCUMENTATION &amp; TRACEABILITY</Label><div className="qlt-records-grid"><div><span className="kicker">THE DETAILS THAT CONNECT</span><h2 id="quality-records-title">Batch records<br /><em>and traceability</em></h2><div className="qlt-record-entries">{qualityRecordTopics.map((topic, index) => <article key={topic.title}><span className="qlt-topic-index" aria-hidden="true">{number(index)}</span><div><h3>{topic.title}</h3><p>{topic.text}</p></div></article>)}</div></div><figure className="qlt-record-image"><img src={recordsImage.src} srcSet={`${recordsImage.small} 600w, ${recordsImage.src} 900w`} sizes="(max-width: 800px) 90vw, 40vw" alt={recordsImage.alt} width="900" height="900" loading="lazy" decoding="async" /><figcaption className={styles.imageCaption}><span>TRACEABILITY CONCEPT</span><span>AI-GENERATED CONCEPT</span></figcaption></figure></div></section>

    <div className="qlt-next content-width"><Link className="qlt-process-link" to="/process" aria-labelledby="quality-process-title"><div><span className="kicker">THE NEXT CHAPTER / PROCESS</span><h2 id="quality-process-title">From first email<br /><em>to first shipment</em></h2></div><span className="qlt-process-arrow" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M7 24h34M29 12l12 12-12 12" /></svg></span></Link></div>
    <PageReview page="quality" />
  </div>;
}
