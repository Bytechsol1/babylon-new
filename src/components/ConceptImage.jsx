import { editorialImages } from '../editorialImages.js';
import styles from './ConceptImage.module.css';

export default function ConceptImage({ name, variant = 'card' }) {
  const image = editorialImages[name];
  const sizes = variant === 'banner' ? '(max-width: 1511px) 90vw, 1360px' : variant === 'wide' ? '(max-width: 800px) 90vw, 40vw' : '(max-width: 800px) 90vw, (max-width: 1511px) 30vw, 420px';
  return <figure className={`${styles.figure} ${styles[variant]}`} data-ai-concept={name}>
    <img src={image.src} srcSet={`${image.small} 600w, ${image.src} 1200w`} sizes={sizes} alt={image.alt} width="1200" height="800" loading="lazy" decoding="async" />
    <figcaption><span>{image.label}</span></figcaption>
  </figure>;
}
