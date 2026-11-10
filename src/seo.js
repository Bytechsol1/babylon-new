// Awaiting the final custom domain from Babylon. This is public SEO configuration,
// independent of the inquiry backend's SITE_ORIGIN; never read server secrets here.
export const siteOrigin = null;

export const pageSEO = {
  '/': { title: 'Cosmetics, engineered. | Babylon', description: 'We formulate, manufacture and fill skincare and personal-care products for brands. Based in San Jose, California, since 2016.' },
  '/services': { title: 'OEM, ODM & Co-development Services | Babylon', description: 'Compare OEM, ODM and co-development: what you bring, our formulation and manufacturing work, and your project approval steps.' },
  '/capabilities': { title: 'Formulation & Manufacturing Capabilities | Babylon', description: 'Explore formulation, colloid and emulsion science, materials selection, process engineering, scale-up and quality control methods.' },
  '/products': { title: 'What We Make: Skincare & Personal Care | Babylon', description: 'We formulate, manufacture and fill cosmetics for skincare and personal-care brands, starting from an existing formula or a product brief.' },
  '/quality': { title: 'Quality Checks & Lot Traceability | Babylon', description: 'Read about cosmetics GMP certification, QC specification review, production records and lot traceability. Testing scope is project-specific.' },
  '/process': { title: 'From Inquiry to Production & Shipping | Babylon', description: 'Follow six project stages, from inquiry and a product brief to samples, a pilot batch, production and shipping, with customer review checkpoints.' },
  '/about': { title: 'About Babylon: Cosmetics Manufacturing in San Jose', description: 'Founded in 2016 in San Jose, California, we work in cosmetic formulation, manufacturing and filling, with in-house production technology.' },
  '/faq': { title: 'Cosmetics Manufacturing FAQ | Babylon', description: 'Answers about OEM, ODM, co-development, existing formulas, product categories, quality review, certification and our San Jose company.' },
  '/contact': { title: 'Start a Cosmetics Project | Contact Babylon', description: 'Share your product, texture, packaging, quantity, target markets and launch date. Contact us at info@babylonllc.com in San Jose, California.' },
};
export const notFoundSEO = { title: 'Page Not Found | Babylon', description: 'This page could not be found. Explore our cosmetic manufacturing services or contact us about your project.' };
export function canonicalURL(path, origin = siteOrigin) { return pageSEO[path] && origin ? new URL(path, origin).href : null; }
export function discoveryFiles(origin = siteOrigin) {
  if (!origin) return { robots: 'User-agent: *\nDisallow: /\n', sitemap: null };
  const url = new URL(origin);
  if (url.protocol !== 'https:' || url.origin !== origin || url.username || url.password) throw new Error('The public SEO origin must be the confirmed HTTPS origin, without a path or credentials.');
  return {
    robots: `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`,
    sitemap: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.keys(pageSEO).map(route => `  <url><loc>${canonicalURL(route, origin)}</loc></url>`).join('\n')}\n</urlset>\n`,
  };
}
export function updatePageSEO(path) {
  const metadata = pageSEO[path] || notFoundSEO;
  document.title = metadata.title;
  for (const [name, content] of Object.entries({ description: metadata.description, robots: pageSEO[path] && siteOrigin ? 'index, follow' : 'noindex, follow' })) {
    let meta = document.head.querySelector(`meta[name="${name}"]`);
    if (!meta) { meta = document.createElement('meta'); meta.name = name; document.head.append(meta); }
    meta.content = content;
  }
  let canonical = document.head.querySelector('link[rel="canonical"]');
  const url = canonicalURL(path);
  if (!url) canonical?.remove();
  else { if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); } canonical.href = url; }
}
