import { useId, useState } from 'react';
import { contactConfig } from '../contactConfig.js';

const feedback = [
  { topic: 'Formulation', quote: 'Our idea finally felt like our brand. From the first texture to the finishing touch, every detail had a purpose.', role: 'Skincare brand founder' },
  { topic: 'Production', quote: 'Care in the small things makes room for the big things. That’s the kind of manufacturing partnership we look for.', role: 'Personal care brand team' },
  { topic: 'Partnership', quote: 'More than a formula, we wanted a conversation. A team that could see the possibility in what we were trying to create.', role: 'Independent beauty founder' },
];

export function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const item = feedback[active];
  return <section className="voices-section closing-container" id="testimonials" aria-labelledby="voices-title">
    <div className="closing-eyebrow"><span>04 / BETTER, TOGETHER</span><i aria-hidden="true" /><span>THE HUMAN SIDE OF THE SCIENCE.</span></div>
    <div className="voices-grid">
      <div className="voices-intro"><p className="closing-kicker">GOOD CHEMISTRY. GREAT PARTNERSHIPS.</p><h2 id="voices-title">Made with care.<br /><em>Shared with pride.</em></h2><p>Behind every formula is a conversation. Every possibility begins with people who see things a little differently.</p><span className="voices-sample-label">EXAMPLE TESTIMONIALS</span></div>
      <div className="voices-feature">
        <span className="voices-quote-mark" aria-hidden="true">“</span>
        <div className="voices-slide" aria-live="polite" aria-atomic="true"><blockquote key={active}>{item.quote}</blockquote><div className="voices-credit"><span className="voices-avatar" aria-hidden="true">{String(active + 1).padStart(2, '0')}</span><div><strong>{item.role}</strong><span>Illustrative feedback · {item.topic}</span></div></div></div>
        <div className="voices-controls"><span className="voices-count">0{active + 1}<span> / 03</span></span><div className="voices-dots" aria-label="Choose a testimonial">{feedback.map((review, index) => <button type="button" key={review.topic} aria-label={`Show ${review.topic.toLowerCase()} testimonial`} aria-pressed={active === index} onClick={() => setActive(index)}><span /></button>)}</div><div className="voices-arrows"><button type="button" aria-label="Previous testimonial" onClick={() => setActive((active + feedback.length - 1) % feedback.length)}>←</button><button type="button" aria-label="Next testimonial" onClick={() => setActive((active + 1) % feedback.length)}>→</button></div></div>
      </div>
    </div>
  </section>;
}

export function ContactSection() {
  const id = useId();
  const [result, setResult] = useState(null);
  const [brief, setBrief] = useState('');
  const hasDestination = Boolean(contactConfig.whatsapp || contactConfig.email);

  function downloadBrief(text) {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'babylon-project-enquiry.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = `BABYLON — PROJECT ENQUIRY\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nBrand: ${data.get('brand') || 'Not specified'}\nService: ${data.get('service')}\nQuantity: ${data.get('quantity') || 'To be discussed'}\n\nThe idea\n${data.get('message')}\n`;
    setBrief(text);
    if (contactConfig.whatsapp) {
      window.open(`https://wa.me/${contactConfig.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
      setResult('whatsapp');
    } else if (contactConfig.email) {
      window.location.href = `mailto:${contactConfig.email}?subject=${encodeURIComponent(`Project enquiry — ${data.get('brand') || data.get('name')}`)}&body=${encodeURIComponent(text)}`;
      setResult('email');
    } else {
      downloadBrief(text);
      setResult('brief');
    }
  }

  return <section className="contact-section" id="contact" aria-labelledby="contact-title">
    <div className="contact-grid closing-container">
      <div className="contact-intro"><p className="closing-kicker">05 / LET’S TALK CHEMISTRY</p><h2 id="contact-title" tabIndex={-1}>A bold idea.<br /><em>A beautiful <br />beginning.</em></h2><p>A new texture. A better formula. A brand ready for its next chapter. Tell us what’s on your mind.</p><ol className="contact-steps"><li><span>01</span>Share the spark.</li><li><span>02</span>Find your formula.</li><li><span>03</span>Make it real.</li></ol><div className="contact-note"><span>FROM FIRST CONVERSATION<br />TO YOUR NEXT CREATION.</span></div></div>
      <div className="contact-form-wrap">
        <div className="contact-form-heading"><span>YOUR NEXT CHAPTER STARTS HERE.</span><span aria-hidden="true">↗</span></div>
        <form className="contact-form" onSubmit={submit}>
          <div className="contact-field"><label htmlFor={`${id}-name`}>Your name <span>*</span></label><input id={`${id}-name`} name="name" autoComplete="name" placeholder="First and last name" required maxLength={100} /></div>
          <div className="contact-field"><label htmlFor={`${id}-email`}>Email address <span>*</span></label><input id={`${id}-email`} name="email" type="email" autoComplete="email" placeholder="you@yourbrand.com" required maxLength={200} /></div>
          <div className="contact-field"><label htmlFor={`${id}-brand`}>Brand / company</label><input id={`${id}-brand`} name="brand" autoComplete="organization" placeholder="The name behind the idea" maxLength={150} /></div>
          <div className="contact-field"><label htmlFor={`${id}-service`}>What do you need? <span>*</span></label><select id={`${id}-service`} name="service" defaultValue="" required><option value="" disabled>Select a service</option>{['Bulk manufacturing', 'Fill + assembly', 'Full service', 'Ready-to-go formulas', 'Co-development', 'Let’s figure it out together'].map(option => <option key={option}>{option}</option>)}</select></div>
          <div className="contact-field contact-field-wide"><label htmlFor={`${id}-quantity`}>Estimated quantity</label><input id={`${id}-quantity`} name="quantity" type="number" min="1" step="1" placeholder="How many units are you thinking?" /></div>
          <div className="contact-field contact-field-wide"><label htmlFor={`${id}-message`}>Tell us about your idea <span>*</span></label><textarea id={`${id}-message`} name="message" placeholder="The product, the feeling, the possibility…" required minLength={15} maxLength={4000} rows={4} /></div>
          <div className="contact-submit-row"><p>{hasDestination ? 'Your enquiry opens in your chosen messaging app. You review it before sending.' : 'Prepare a project brief to download and share with your team.'}</p><button className="closing-cta" type="submit">{contactConfig.whatsapp ? 'Continue in WhatsApp' : contactConfig.email ? 'Open email enquiry' : 'Prepare my enquiry'}<span aria-hidden="true">↗</span></button></div>
          {result && <div className="contact-result" role="status"><span aria-hidden="true">✓</span><div><strong>{result === 'brief' ? 'Your project brief is ready.' : result === 'whatsapp' ? 'Continue in WhatsApp to send your enquiry.' : 'Review and send your enquiry in your email app.'}</strong><p>{result === 'brief' ? 'Your download contains your project details. No enquiry has been sent.' : 'Your enquiry is sent only when you confirm it in the messaging app.'}</p><button type="button" onClick={() => downloadBrief(brief)}>Download a copy <span aria-hidden="true">↓</span></button></div></div>}
        </form>
      </div>
    </div>
  </section>;
}

const questions = [
  { question: 'Can you work with a small or independent brand?', answer: 'Yes. Babylon caters to both established and independent brands, with bulk, filling and assembly, and full-service manufacturing options to suit different stages of growth.' },
  { question: 'What are your minimum order quantities?', answer: 'Minimum order quantities are 2,500–3,500 units, with capacity for 500,000+ units. Share your product and quantity through the contact form so we can discuss the right manufacturing option.' },
  { question: 'How long will my product take to launch?', answer: 'Ready-to-go formulas have lead times of 4–6 months. Co-development has lead times of 6–12 months. Your project’s timeline can be discussed once the formula, packaging and scope are defined.' },
  { question: 'Can I supply my own bulk product and packaging?', answer: 'Yes. With fill + assembly, you provide the bulk product and packaging. We fill, assemble and prepare the order for shipment. If you only need bulk manufacturing, pickup or delivery is also available.' },
  { question: 'What testing is included?', answer: 'Microbial testing to USP 61 and/or USP 62 is performed on each full batch at no additional cost. An MSDS is available with a full order. Stability and component compatibility services are available, while preservative efficacy testing and RIPT / skin sensitivity testing are available on request for an additional fee.' },
  { question: 'Can you accommodate a rush order?', answer: 'Our cGMP facility has five filling lines and scheduling capacity to accommodate rush orders. Tell us your target date early so we can discuss availability for your specific project.' },
  { question: 'Do you help with formulation and regulatory requirements?', answer: 'Our formulators and regulatory specialists work closely together on bringing products to market and compliance with the federal, state and international requirements of your intended markets.' },
  { question: 'How do I get started?', answer: 'Share your name, email, service of interest and a few details about your product in the contact form. An existing formula, a new concept or an early idea is a useful starting point.' },
];

export function FAQSection() {
  return <section className="faq-section closing-container" id="faqs" aria-labelledby="faq-title">
    <div className="closing-eyebrow"><span>06 / A LITTLE CLARITY</span><i aria-hidden="true" /><span>GOOD QUESTIONS. THOUGHTFUL ANSWERS.</span></div>
    <div className="faq-grid">
      <div className="faq-intro"><p className="closing-kicker">THE THINGS YOU’RE WONDERING</p><h2 id="faq-title">Curious?<br /><em>Good.</em></h2><p>We like a better question.<br />Here are a few to get you started.</p><a className="faq-contact-link" href="#contact">Let’s talk about your idea <span aria-hidden="true">↗</span></a></div>
      <div className="faq-content"><div className="faq-list">{questions.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div></div>
    </div>
  </section>;
}

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="closing-container">
      <div className="footer-invitation">
        <div className="footer-invitation-label"><span>THE NEXT CHAPTER STARTS HERE.</span><span>BABYLON / EST. 2016</span></div>
        <div className="footer-invitation-grid"><h2>Good chemistry.<br /><em>Great beginnings.</em></h2><div className="footer-invitation-action"><p>From an idea on your mind <br />to a formula in your hands.</p><a href="#contact">Let’s create something <span aria-hidden="true">↗</span></a></div></div>
        <div className="footer-invitation-line"><span>FROM MOLECULE</span><i aria-hidden="true" /><span>TO MARKET.</span></div>
      </div>
      <div className="footer-information">
        <div className="footer-identity"><a href="#" aria-label="Babylon home"><img src={`${import.meta.env.BASE_URL}babylon-favicon.png?v=5`} alt="Babylon" width="200" height="200" loading="lazy" /></a><p>Cosmetic science, thoughtfully made.<br />Your vision. Our element.</p></div>
        <nav className="footer-link-group" aria-label="Explore Babylon"><span>OUR WORLD</span><a href="#about">About Babylon</a><a href="#manufacturing">Manufacturing</a><a href="#testimonials">Partnerships</a></nav>
        <nav className="footer-link-group" aria-label="Contact and help"><span>YOUR NEXT STEP</span><a href="#contact">Start a project <span aria-hidden="true">↗</span></a><a href="#faqs">Questions &amp; answers</a>{contactConfig.email && <a href={`mailto:${contactConfig.email}`}>Email Babylon</a>}{contactConfig.whatsapp && <a href={`https://wa.me/${contactConfig.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp <span aria-hidden="true">↗</span></a>}</nav>
        <div className="footer-signoff"><p>A little curiosity.<br /><em>Endless possibility.</em></p></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Babylon. All rights reserved.</span><span>PRECISION SCIENCE. UNCONVENTIONAL THINKING.</span><a href="#">Back to top <span aria-hidden="true">↑</span></a></div>
    </div>
  </footer>;
}
