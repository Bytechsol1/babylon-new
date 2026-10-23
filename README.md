# Babylon React

Responsive cream and navy hero built with React, Vite, CSS, and Three.js.

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

## Edit the website

- `src/components/Header.jsx`: brand, navigation, and mobile menu.
- `src/components/Hero.jsx`: heading, introduction, and calls to action.
- `src/components/MaterialStudy.jsx`: product selection, motion controls, and scene lifecycle.
- `src/scene.js`: Three.js geometry, lighting, materials, and animation.
- `src/components/InfoDialog.jsx`: information panels and downloadable project brief.
- `src/styles.css`: colors, typography, layout, and responsive styles.

The 3D scene loads separately and releases its WebGL resources when unmounted. A CSS composition appears while it loads or when WebGL is unavailable. Reduced motion preferences are respected.

The project form downloads a local text brief; it does not submit enquiries to a backend. Product studies are illustrative design concepts.
