// Only source-backed, explicitly approved records belong here.
// Pending format proposals live exclusively in src/review/siteReview.js.
export const productFormatRecords = [];
export const confirmedProductFormats = productFormatRecords.filter(item => item.status === 'approved' && item.source?.trim() && item.name?.trim() && item.description?.trim());

// Existing public brief guidance; these are discussion topics, not product offerings.
export const productBriefStudies = [
  { id: 'intended-use', title: 'Intended use', text: 'Describe who the product is for, where it will be used, and what you want it to do.', question: "I'd like to discuss the intended use of a new product." },
  { id: 'texture-application', title: 'Texture & application', text: 'Explain the desired feel, appearance, and application experience. Reference examples can help frame the discussion.', question: "I'd like to discuss texture and application for a product." },
  { id: 'packaging-markets', title: 'Packaging & markets', text: 'Share packaging ideas, dispensing requirements, and intended markets so these can be considered in the project review.', question: "I'd like to discuss packaging and target markets for a product." },
];
