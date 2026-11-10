// Only source-backed, explicitly approved records belong here.
// Pending format proposals live exclusively in src/review/siteReview.js.
export const productFormatRecords = [];
export const confirmedProductFormats = productFormatRecords.filter(item => item.status === 'approved' && item.source?.trim() && item.name?.trim() && item.description?.trim());

// Broad positioning approved in the supplied rewrite; not a list of formats.
export const confirmedProductCategories = [
  { id: 'skincare', name: 'Skincare', description: 'We work with skincare brands, starting from an existing formula or a product brief.', question: "I'd like to check the scope for a skincare product." },
  { id: 'personal-care', name: 'Personal care', description: 'We formulate, manufacture and fill cosmetic products for personal-care brands.', question: "I'd like to check the scope for a personal-care product." },
];

// Existing brief tips from approved snapshot 4afdd96, now used only on Contact.
export const productBriefGuidance = [
  { id: 'intended-use', title: 'Intended use', text: 'Describe who the product is for, where it will be used, and what you want it to do.' },
  { id: 'texture-application', title: 'Texture & application', text: 'Explain the desired feel, appearance, and application experience. Reference examples can help frame the discussion.' },
  { id: 'packaging-markets', title: 'Packaging & markets', text: 'Share packaging ideas, dispensing requirements, and intended markets so these can be considered in the project review.' },
];
