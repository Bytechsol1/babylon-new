// Each editorial placement has its own asset. These are conceptual AI images,
// never documentation of Babylon's actual products, people, premises or tests.
const files = import.meta.glob('./assets/editorial-v2/*.webp', { eager: true, query: '?url', import: 'default' });
const concept = (id, label, description, width = 1200, height = 800) => {
  const src = files[`./assets/editorial-v2/${id}.webp`];
  const small = files[`./assets/editorial-v2/${id}-small.webp`];
  if (!src || !small) throw new Error(`Missing editorial image variant: ${id}`);
  return Object.freeze({
    src, small, width, height, label,
    alt: `Illustrative concept: ${description}. Not a photograph of Babylon products, staff, facilities, equipment or actual tests.`,
  });
};

export const editorialImages = Object.freeze({
  'home-hero': concept('home-hero', 'COSMETIC TEXTURE STUDY', 'a sculptural ivory cream ribbon and transparent golden gel droplet on frosted glass'),
  'home-partnership': concept('home-partnership', 'COSMETIC DEVELOPMENT', 'an overhead palette of cream, gel and oil textures with blank material swatches'),
  'home-oem': concept('home-oem', 'OEM · YOUR FORMULA', 'a close view of a dosing tip and a single lotion bead'),
  'home-odm': concept('home-odm', 'ODM · YOUR BRIEF', 'a palette knife spreading a pale peach cosmetic emulsion across a ceramic tile'),
  'home-codevelopment': concept('home-codevelopment', 'CO-DEVELOPMENT', 'two cosmetic textures meeting on a glass palette between two separate spatulas'),
  'home-technology': concept('home-technology', 'PRODUCTION TECHNOLOGY', 'an inspection lens and amber beam crossing a glass prism on an abstract track'),
  'home-quality': concept('home-quality', 'SAMPLE REVIEW', 'a thin ivory sample film on a glass slide held by a metal clip'),
  'home-process': concept('home-process', 'FROM INQUIRY TO SHIPPING', 'an ivory ribbon connecting abstract samples and a plain paper package'),
  'services-oem': concept('services-oem', 'OEM', 'a stainless transfer funnel above a shallow bowl of cosmetic emulsion'),
  'services-odm': concept('services-odm', 'ODM', 'a fan of cosmetic texture swatches on a ceramic palette'),
  'services-codevelopment': concept('services-codevelopment', 'CO-DEVELOPMENT', 'two anonymous hands discussing texture samples on ceramic tiles'),
  'services-formulation': concept('services-formulation', 'FORMULATION & DEVELOPMENT', 'a glass mortar and pestle blending a pale cream beside a small powder sample'),
  'services-manufacturing': concept('services-manufacturing', 'MANUFACTURING & FILLING', 'a close detail of a filling bar and plain cylindrical openings, without identifying a packaging offering'),
  'services-documentation': concept('services-documentation', 'REGULATORY SUPPORT & FULFILLMENT', 'a closed navy folio, blank vellum and a plain ivory carton'),
  'services-process': concept('services-process', 'FROM BRIEF TO PRODUCTION', 'a continuous rail with abstract ceramic sample discs in different stages'),
  'capabilities-hero': concept('capabilities-hero', 'FORMULATION & SAMPLE REVIEW', 'a glass stirring rod lifting a fine translucent gel thread from a rectangular cell'),
  'cap-formulation': concept('cap-formulation', 'BRIEF → FORMULA', 'a stainless spatula spreading a cream crescent over a matte navy mixing slab', 900, 900),
  'cap-emulsion': concept('cap-emulsion', 'PHASES & TEXTURE', 'an abstract macro of translucent droplets dispersed through an ivory fluid, not a microscope image', 900, 900),
  'cap-materials': concept('cap-materials', 'MATERIALS & PACKAGING', 'a flat-lay library of frosted glass, steel, powder, paste and clear film', 900, 900),
  'cap-process': concept('cap-process', 'METHOD & REPEATABILITY', 'a helical mixing paddle and circular flow lines in pale emulsion', 900, 900),
  'cap-scale': concept('cap-scale', 'SAMPLE → PRODUCTION', 'a narrow stream connecting a small glass recess to a much broader shallow basin', 900, 900),
  'cap-qc': concept('cap-qc', 'SPECIFICATIONS & REVIEW', 'a freestanding optical loupe beside thin samples on an inspection plate', 900, 900),
  'products-hero': concept('products-hero', 'COSMETIC TEXTURE STUDY', 'pearlescent gel folds and an emulsion stripe around a navy sculptural block'),
  'products-skincare': concept('products-skincare', 'SKINCARE TEXTURE STUDY', 'a close view of a feathered ivory cream smear on translucent glass'),
  'products-personal-care': concept('products-personal-care', 'PERSONAL-CARE TEXTURE STUDY', 'silky gel waves and tiny clear bubbles across a ridged ceramic surface'),
  'quality-hero': concept('quality-hero', 'SAMPLE-HANDLING ILLUSTRATION', 'a gloved hand holding a flat sample spatula above a glass slab', 1000, 1000),
  'quality-records': concept('quality-records', 'TRACEABILITY CONCEPT', 'blank index cards linked by a gold thread to anonymous frosted sample cubes', 900, 900),
  'process-inquiry': concept('process-inquiry', 'START THE CONVERSATION', 'a closed-facing navy laptop, blank folded note and gold pencil', 900, 900),
  'process-brief': concept('process-brief', 'DEFINE THE BRIEF', 'a blank sheet, tactile material swatches and a drafting pencil', 900, 900),
  'process-formula': concept('process-formula', 'FORMULATION & TRANSFER', 'two clear glass channels linked by a continuous stream of pale emulsion', 900, 900),
  'process-samples': concept('process-samples', 'EVALUATION & FEEDBACK', 'three ceramic sample tiles and a stainless evaluation wand', 900, 900),
  'process-pilot': concept('process-pilot', 'PILOT BATCH', 'a small steel vessel of emulsion with a separate mixing blade resting beside it', 900, 900),
  'process-shipping': concept('process-shipping', 'PRODUCTION & SHIPPING', 'a plain corrugated carton with paper cushioning and an unmarked inner box', 900, 900),
  'about-hero': concept('about-hero', 'ILLUSTRATIVE BRAND STUDY', 'folded navy material, an ivory plinth, a pearl-cream wave and a curved gold strip', 900, 1200),
});
