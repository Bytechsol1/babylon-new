# Babylon React

Responsive cream and navy hero built with React, Vite, and CSS, featuring the supplied Babylon logo and hero image.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:4187.

## Production

```sh
npm run build
npm run preview
```

Vite generates the production site in `dist/`.

The website uses the locally hosted Manrope variable font. Responsive type sizes and weights are defined in `src/typography.css`; the font and its SIL Open Font License are in `src/assets/fonts/`.

## Edit the website

- `src/components/Header.jsx`: brand, navigation, and mobile menu.
- `src/components/Hero.jsx`: heading, introduction, and calls to action.
- `src/components/MaterialStudy.jsx`: circular photograph and revolving process labels.
- `src/components/ProcessStrip.jsx`: Formulate, Refine, and Scale process strip.
- `src/components/ChemistrySection.jsx`: Serious science section, central chemistry visual, and starting point CTA.
- `src/assets/`: supplied Babylon logo and hero photograph.
- `src/components/InfoDialog.jsx`: information panels and downloadable project brief.
- `src/styles.css`: colors, typography, layout, and responsive styles.
- `src/hero.css`: reference layout, circular composition, typography, and responsive process strip.
- `src/chemistry.css`: three-column chemistry section and responsive layouts.

The hero follows the supplied reference: large navy typography, a circular photographic composition, thin gold orbit lines, revolving process text on an outer circular path, and a three-step process strip. The photographic area is displayed from the supplied reference image with CSS cropping. The process text sits outside the photograph, follows a circular path, pauses on hover or keyboard focus, and respects reduced motion preferences. Desktop and mobile layouts keep the process labels and calls to action accessible.

The project form downloads a local text brief; it does not submit enquiries to a backend. Product studies are illustrative design concepts.

## Contact and closing sections

`src/components/ClosingSections.jsx` contains the testimonial slider, enquiry form, FAQ accordions and footer. The testimonials are explicitly marked as examples; replace them with client-approved reviews before publishing.

Copy `.env.example` to `.env.local` and set `VITE_CONTACT_WHATSAPP` (international digits only) and/or `VITE_CONTACT_EMAIL`, then restart Vite. The form opens a pre-filled WhatsApp message or email draft for the visitor to review and send. Until a destination is configured, it downloads the enquiry as a text brief and does not send it. All project CTAs lead to this form.
