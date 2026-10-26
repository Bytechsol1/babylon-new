import { useEffect, useRef, useState } from 'react';

const panels = {
  science: {
    eyebrow: '01 / THE SCIENCE',
    title: <>Where curiosity<br />becomes chemistry.</>,
    body: <><p>Beauty begins with a better question. What if a formula could feel as extraordinary as it performs?</p><p>Our approach brings ingredient exploration, sensory design, and careful formulation together. Every texture, every drop, every detail has a purpose.</p></>,
  },
  lab: {
    eyebrow: '02 / THE LAB',
    title: <>A space for<br />what comes next.</>,
    body: <><p>The lab is where bold ideas become tangible. A texture to touch. A finish to refine. A new possibility to explore.</p><p>Explore the amber serum, cream formulation, and laboratory glassware in our featured material study.</p></>,
  },
  process: {
    eyebrow: '03 / THE PROCESS',
    title: <>From a spark<br />to something real.</>,
    body: <ol><li><strong>Discover.</strong> Define your vision and the experience.</li><li><strong>Formulate.</strong> Explore ingredients and textures.</li><li><strong>Refine.</strong> Evaluate, learn, and perfect the details.</li><li><strong>Scale.</strong> Plan the journey from concept to creation.</li></ol>,
  },
  practice: {
    eyebrow: '04 / IN PRACTICE',
    title: <>Ideas you<br />can almost feel.</>,
    body: <><p><strong>Study 001 — The amber serum.</strong><br />A golden, light-catching composition that explores clarity, richness, and precision.</p><p><strong>Study 002 — The daily cream.</strong><br />A soft, sculptural interpretation of nourishment and a slower daily ritual.</p><p className="form-note">These interactive material studies are design concepts.</p></>,
  },
};

function ProjectForm({ onClose }) {
  const [downloaded, setDownloaded] = useState(false);
  function downloadBrief(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = `BABYLON — PROJECT BRIEF\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\n\nThe idea\n${data.get('idea')}\n\nFrom molecule to market.\n`;
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'babylon-project-brief.txt';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  }
  if (downloaded) return <><span className="success-mark" aria-hidden="true">↗</span><p>Your project brief is ready. Find <strong>babylon-project-brief.txt</strong> in your downloads and share it with your team when you’re ready.</p><button className="button" onClick={onClose}>Keep exploring <span aria-hidden="true">↗</span></button></>;
  return (
    <form className="brief-form" onSubmit={downloadBrief}>
      <label>Your name<input name="name" autoComplete="name" required maxLength={100} placeholder="What should we call you?" /></label>
      <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={200} placeholder="you@yourbrand.com" /></label>
      <label>Your idea<textarea name="idea" required maxLength={3000} placeholder="A serum, a new texture, a completely new idea…" /></label>
      <button className="button" type="submit">Download your project brief <span aria-hidden="true">↗</span></button>
      <p className="form-note">Save a brief to share with your team. Your details stay in your browser; this demo does not send enquiries.</p>
    </form>
  );
}

export default function InfoDialog({ panel, onOpen, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (panel && !dialog.open) dialog.showModal();
    else if (!panel && dialog.open) dialog.close();
  }, [panel]);

  function closeOnBackdrop(event) {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
  }
  const project = panel === 'project';
  const content = panels[panel];
  return (
    <dialog ref={dialogRef} id="info-dialog" aria-labelledby="dialog-title" onClick={closeOnBackdrop} onClose={onClose} onCancel={event => { event.preventDefault(); onClose(); }}>
      <button className="dialog-close" aria-label="Close dialog" onClick={onClose}>×</button>
      <span className="eyebrow" id="dialog-eyebrow">{project ? 'LET’S TALK CHEMISTRY' : content?.eyebrow}</span>
      <h2 id="dialog-title">{project ? <>Something remarkable<br />starts here.</> : content?.title}</h2>
      <div id="dialog-content">
        {project ? <ProjectForm onClose={onClose} /> : content && <>{content.body}<button className="button" onClick={() => onOpen('project')}>Bring your idea to life <span aria-hidden="true">↗</span></button></>}
      </div>
    </dialog>
  );
}
