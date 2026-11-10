import { useEffect } from 'react';
import { Link } from '../router.jsx';
import { workModels } from '../editorialContent.js';
import styles from './ServicesComparison.module.css';
import ConceptImage from './ConceptImage.jsx';

const modelImages = { oem: 'services-oem', odm: 'services-odm', 'co-development': 'services-codevelopment' };

const modelWork = {
  oem: 'We transfer your formula, prepare samples and plan manufacturing and filling.',
  odm: 'We develop a formulation from your brief and prepare samples for your review.',
  'co-development': 'We share formulation, materials and process development with you.',
};
const approvalSteps = {
  oem: 'You review the bench sample, project-specific test requirements and pilot batch.',
  odm: 'You review development samples, project-specific test requirements and the pilot batch.',
  'co-development': 'You review each development round, project-specific test requirements and the pilot batch.',
};

// Broad offerings are approved; detailed regulatory and fulfillment scope is not.
export const serviceScope = [
  { title: 'Formulation and R&D', image: 'services-formulation', items: [
    { label: 'Formulation', text: 'We develop formulations from a product brief or work with a formula in progress.' },
    { label: 'Development', text: 'We prepare samples for your evaluation.' },
  ] },
  { title: 'Manufacturing and filling', image: 'services-manufacturing', items: [
    { label: 'Manufacturing', text: 'We manufacture skincare and personal-care products from product specifications.' },
    { label: 'Filling', text: 'Filling is part of our cosmetic manufacturing offering. Specific product and packaging formats await confirmation.' },
  ] },
  { title: 'Regulatory support and fulfillment', image: 'services-documentation', items: [
    { label: 'Regulatory support', text: 'We offer regulatory support. Specific services and deliverables await confirmation.' },
    { label: 'Fulfillment', text: 'We offer fulfillment. Shipping arrangements and service scope await confirmation.' },
  ] },
];

export default function ServicesComparison() {
  useEffect(() => {
    // Preserve existing /services#oem, #odm and #co-development destinations.
    const scrollToModel = () => {
      const model = workModels.find(item => `#${item.id}` === window.location.hash);
      if (model) document.getElementById(model.id)?.scrollIntoView({ block: 'start' });
    };
    const frame = requestAnimationFrame(scrollToModel);
    window.addEventListener('hashchange', scrollToModel);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('hashchange', scrollToModel);
    };
  }, []);

  const rows = [
    { id: 'bring', label: 'You bring', value: model => model.brings },
    { id: 'work', label: 'We do', value: model => modelWork[model.id] },
    { id: 'ownership', label: 'Formula ownership', value: model => model.ownership },
    { id: 'approval', label: 'Your approval steps', value: model => approvalSteps[model.id] },
  ];
  return <table className={styles.comparison} role="table" aria-label="Compare OEM, ODM and co-development">
    <caption className="visually-hidden">What you bring, our work, formula ownership and approval steps by service model</caption>
    <thead role="rowgroup"><tr role="row"><th className="visually-hidden" scope="col" role="columnheader">Comparison</th>{workModels.map((model, index) => <th scope="col" role="columnheader" className={styles.heading} style={{ '--column': index + 1, '--row': 1 }} id={model.id} key={model.id}>
      <span className="kicker">{model.code}</span><h2 id={`${model.id}-heading`}>{model.name}</h2><p>{model.startingPoint}</p><ConceptImage name={modelImages[model.id]} />
    </th>)}</tr></thead>
    <tbody role="rowgroup">{rows.map((row, rowIndex) => <tr role="row" key={row.id}><th className="visually-hidden" scope="row" role="rowheader" id={`compare-${row.id}`}>{row.label}</th>{workModels.map((model, index) => <td role="cell" key={model.id} headers={`compare-${row.id} ${model.id}`} data-model={model.id} data-field={row.id} className={styles.field} style={{ '--column': index + 1, '--row': rowIndex + 2 }}><span className={styles.fieldLabel} aria-hidden="true">{row.label}</span><p>{row.value(model)}</p></td>)}</tr>)}</tbody>
    <tfoot role="rowgroup"><tr role="row"><th className="visually-hidden" scope="row" role="rowheader" id="compare-start">Discuss a model</th>{workModels.map((model, index) => <td role="cell" headers={`compare-start ${model.id}`} className={styles.action} style={{ '--column': index + 1, '--row': 6 }} key={model.id}><Link className="partnership-cta" to={`/contact?model=${encodeURIComponent(model.code)}`}>Start with {model.code}<span aria-hidden="true">→</span></Link></td>)}</tr></tfoot>
  </table>;
}
