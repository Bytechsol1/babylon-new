import { editorialImages } from '../editorialImages.js';
import styles from './MaterialStudy.module.css';
const image = editorialImages['home-hero'];

// Preserve the approved frame while giving this placement its own illustration.
export default function MaterialStudy() {
  return (
    <div className="hero-visual">
      <div className={`circular-photo ${styles.frame}`}>
        <img className={styles.image} src={image.src} srcSet={`${image.small} 600w, ${image.src} 1200w`} sizes="(max-width: 800px) 90vw, 55vw" alt={image.alt} width={image.width} height={image.height} fetchPriority="high" decoding="async" />
      </div>
    </div>
  );
}
