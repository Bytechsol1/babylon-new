export const contactConfig = {
  email: (import.meta.env.VITE_CONTACT_EMAIL || '').trim(),
  whatsapp: (import.meta.env.VITE_CONTACT_WHATSAPP || '').replace(/\D/g, ''),
};
