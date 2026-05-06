# AST Nexus — Cinematic 3D Website

> **Intelligence. Systems. Future.**
> A high-budget, scroll-driven 3D website built with React, Three.js, and GSAP.

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 18 + Vite 5 |
| 3D Engine | Three.js + React Three Fiber |
| 3D Helpers | @react-three/drei (Stars, Environment) |
| Post-FX | @react-three/postprocessing (Bloom, Chromatic Aberration) |
| Animations | Framer Motion (UI) |
| Scroll Camera | Custom scroll-driven camera path (GSAP-ready) |
| Fonts | Orbitron · Space Grotesk · Inter (Google Fonts) |

---

## Install Dependencies

```bash
cd ast-nexus-site
npm install
```

> Requires **Node.js 18+**

---

## Run Locally

```bash
npm run dev
```

Opens at **http://localhost:5173**

---

## Build for Production

```bash
npm run build
```

Output goes to `dist/`. Preview with:

```bash
npm run preview
```

---

## Project Structure

```
ast-nexus-site/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── LoadingScreen.jsx   # Animated loading screen
│   │   ├── Navigation.jsx      # Glassmorphism floating nav
│   │   ├── sections/
│   │   │   ├── Hero.jsx        # Full-screen hero
│   │   │   ├── About.jsx       # About + stats
│   │   │   ├── Services.jsx    # Service cards grid
│   │   │   ├── ChipJourney.jsx # Journey milestones section
│   │   │   ├── WhyUs.jsx       # Pillars + manifesto quote
│   │   │   └── Contact.jsx     # CTA + footer
│   │   └── three/
│   │       ├── Scene.jsx       # Camera controller + lighting + effects
│   │       ├── Chip.jsx        # Procedural CPU chip model
│   │       ├── ParticleField.jsx  # Ambient 3D particles
│   │       └── DataStreams.jsx  # Animated circuit data flows
│   ├── hooks/
│   │   └── useScrollProgress.js
│   ├── App.jsx                 # Root: Canvas + HTML overlay
│   ├── main.jsx
│   └── index.css               # Global styles + design tokens
├── index.html
├── vite.config.js
└── package.json
```

---

## How the 3D Scroll Journey Works

The page height is determined by the HTML sections stacking naturally (~700vh total). A fixed `<Canvas>` sits behind the HTML layer. Inside the Canvas, `CameraController` reads `window.scrollY` every frame and interpolates the camera through 10 keyframe positions — from a wide establishing shot of the chip, zooming all the way inside the die, then pulling back for the finale.

**Camera path keyframes (scroll progress → camera position):**

| Scroll | View |
|---|---|
| 0% | Wide shot — chip tiny in space |
| 12% | Approaching — chip grows |
| 25% | Angled cinematic — services reveal |
| 50% | Arriving at chip surface |
| 60% | On the chip, looking across the die |
| 68% | Inside — fly-through of circuits |
| 76% | Deep inside the core |
| 85% | Pulling back — why us reveal |
| 100% | Wide final shot — contact |

---

## Editing Guide

### Change colors
Edit CSS custom properties at the top of `src/index.css`:
```css
:root {
  --gold: #c9a84c;
  --cyan: #00d4ff;
  /* ... */
}
```

### Change camera path
Edit `CAM_KEYS` array in `src/components/three/Scene.jsx`.

### Add/remove services
Edit the `SERVICES` array in `src/components/sections/Services.jsx`.

### Adjust bloom / glow intensity
In `src/components/three/Scene.jsx`, find `<Bloom>` and change `intensity`.

### Change chip colors
In `src/components/three/Chip.jsx`, change emissive colors on the materials.

---

## Deploy

### Vercel (recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag and drop dist/ to netlify.com/drop
```

### Cloudflare Pages
```bash
npm run build
# Set build command: npm run build
# Set output directory: dist
```

### Any static host
```bash
npm run build
# Upload contents of dist/ to your host
```

---

## Performance Notes

- Uses `<PerformanceMonitor>` to auto-lower DPR on slow devices
- `<AdaptiveDpr>` reduces pixel ratio when FPS drops
- `multisampling={0}` on EffectComposer saves GPU bandwidth
- Particles use `bufferGeometry` with typed arrays
- Chip geometry is 100% procedural — no model files to load

---

## Browser Support

Chrome 90+ · Firefox 88+ · Safari 15+ · Edge 90+

> Requires WebGL 2.0. Falls back gracefully on unsupported devices.

---

**AST Nexus © 2025 — Intelligence. Systems. Future.**
