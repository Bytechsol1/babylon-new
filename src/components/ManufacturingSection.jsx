import { useId, useRef, useState } from 'react';

const services = [
  { name: 'Bulk', image: 'frame_00110.jpg', imageAlt: 'A metal mixer blending a bulk cream formulation in a glass vessel.', caption: 'FORMULATE. BATCH. CREATE.', heading: 'We make the bulk. You make it yours.', description: 'Exactly the quantity you need, whether a little or a lot. We manufacture your bulk formula, ready for pickup or delivery, so you can take care of the rest.', includes: ['Tailored batch quantities', 'Pickup or delivery', 'Your next step, your way'] },
  { name: 'Fill + assembly', image: 'frame_00160.jpg', imageAlt: 'Amber serum bottles being filled alongside a cream jar on a production line.', caption: 'FILL. ASSEMBLE. FINISH.', heading: 'Your product. Our finishing touch.', description: 'You supply the bulk product and packaging. We fill, assemble and prepare your order for shipment, bringing every part together with care.', includes: ['Your bulk and packaging', 'Precision filling + assembly', 'Ready for shipment'] },
  { name: 'Full service', image: 'frame_00239.jpg', imageAlt: 'A finished collection of amber serums and cream jars against a navy arch.', caption: 'FROM CONCEPT TO COLLECTION.', heading: 'From the first idea to the final detail.', description: 'A complete partnership, from concept to creation. Our formulators and regulatory specialists work together to help bring your finished product to market.', includes: ['Concept + formulation', 'Regulatory collaboration', 'Finished product'] },
];

export default function ManufacturingSection() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef([]);
  const id = useId();
  const service = services[selected];

  function navigateTabs(event, index) {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % services.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + services.length - 1) % services.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = services.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next].focus();
  }

  return <section className="manufacturing-section" id="manufacturing" aria-labelledby="manufacturing-title">
    <div className="mfg-container">
      <div className="mfg-section-label"><span>03 / THE ART OF MAKING</span><span className="mfg-rule" /><span>YOUR VISION. OUR CAPACITY.</span></div>
      <div className="mfg-intro">
        <div><p className="mfg-kicker">CONTRACT MANUFACTURING</p><h2 id="manufacturing-title">Big ideas.<br /><em>Beautifully made.</em></h2></div>
        <div className="mfg-intro-copy"><p>Batching &amp; filling solutions for <strong>cosmetic, skincare &amp; personal care brands.</strong></p><p>From independent beginnings to established names, we make room for your next chapter. Our cGMP facility has five filling lines and scheduling capacity to accommodate rush orders.</p></div>
      </div>

      <dl className="mfg-capacity">
        <div><dt>MINIMUM ORDER QUANTITIES</dt><dd>2,500<span>–</span>3,500<span className="mfg-unit">units</span></dd></div>
        <div><dt>PRODUCTION CAPACITY</dt><dd>500,000<span>+</span><span className="mfg-unit">units</span></dd></div>
        <div><dt>ROOM TO MAKE IT HAPPEN</dt><dd>05<span className="mfg-unit">filling lines</span></dd></div>
      </dl>

      <div className="mfg-services">
        <div className="mfg-service-controls">
          <p className="mfg-kicker">BUILT AROUND YOUR BRAND</p>
          <h3>Three ways.<br /><em>One standard.</em></h3>
          <div className="mfg-tabs" role="tablist" aria-label="Manufacturing services" aria-orientation="vertical">
            {services.map((item, index) => <button key={item.name} ref={node => { tabs.current[index] = node; }} type="button" role="tab" id={`${id}-tab-${index}`} aria-selected={index === selected} aria-controls={`${id}-panel`} tabIndex={index === selected ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={event => navigateTabs(event, index)}><span className="mfg-tab-number">0{index + 1}</span><span>{item.name}</span><span className="mfg-tab-arrow" aria-hidden="true">↗</span></button>)}
          </div>
          <p className="mfg-service-note">A little support or the whole journey.<br />Choose the partnership that fits.</p>
        </div>

        <div className="mfg-service-panel" role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${selected}`} tabIndex={0}>
          <figure className="mfg-production-image"><img key={service.image} src={`${import.meta.env.BASE_URL}frames/${service.image}`} alt={service.imageAlt} width="1280" height="720" loading="lazy" decoding="async" /><span className="mfg-image-label">{service.caption}</span><span className="mfg-image-index" aria-hidden="true">0{selected + 1} / 03</span></figure>
          <div className="mfg-service-detail" key={service.name}><h4>{service.heading}</h4><p>{service.description}</p><ul>{service.includes.map(item => <li key={item}>{item}</li>)}</ul></div>
        </div>
      </div>

      <div className="mfg-section-bottom"><span>FROM FIRST BATCH TO WHAT’S NEXT.</span><span>Made with care. Made with Babylon.</span></div>
    </div>
  </section>;
}
