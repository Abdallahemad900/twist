# TWIST · Blueberry Island

Arabic / English React experience with 13 sections and the existing six GLB can models. This is a local brand concept, not a deployed official storefront.

## Run

Use Node **22.12+** (tested with 24.19) and npm **10.5.1+**.

```sh
npm ci
npm run dev
```

Visit the Vite URL. `npm run build` writes a deployable static site to `dist/`. `npm run preview` serves the production build locally. GitHub Actions runs the same checks and uploads `dist/` as the `twist-production` artifact on every push to main.

## Sections

1. Rotating Blueberry Island hero with floating berries.
2. Scroll-illuminated brand statement.
3. Floating dual-can composition.
4. Scroll-controlled GLSL frost reveal.
5. **All-six-flavor explorer** with front/back, rotation, and water modes.
6. Dynamic SVG morphing and flavor selection.
7. Scrubbed bento gallery using the supplied reference photos.
8. Six Three.js scroll waypoints adapted from Lycoris Specimen.
9. Cursor-driven perspective flavor cards linked to the explorer.
10. Interactive condensation and density controls.
11. All-six-can orbit.
12. Expandable questions and answers.
13. All 12 wet/dry GLB downloads, plus the complete model ZIP.

Footer: elastic bounce entrance with the corrected Twist logo. Intro: supplied Onyx Glyph Preloader adapted to the brand and hero readiness.

## Stack and setup

- GSAP + `@gsap/react` + ScrollTrigger for scroll orchestration and footer bounce.
- `motion` / `motion/react` (Framer Motion's current package) for entrances, morphing, and tilt.
- Lenis, updated by the GSAP ticker, for smooth scrolling and anchor navigation.
- Three.js, React Three Fiber, and Drei for existing models, lighting, frost, and condensation.
- Tailwind 4 via Vite, a shadcn-compatible `components.json`, `@/` alias, `src/components/ui`, and `cn()` utility.
- The two supplied **21st.dev** components are source components, not an npm runtime. Provenance is recorded in `references/README.md`; archived reference source stays local.
- **UI UX Pro Max** is installed as a Codex design skill; its applied guidance and brand overrides are in `design-system/MASTER.md`.
- Fonts are self-hosted: Barlow Condensed and Cairo Variable.

No Blender model generation was used for this redesign. All 12 GLBs match the original V2 SHA-256 manifest in `source-assets/model-sha256.json`. Editable Blender source remains in the local project and is not included in this website repository. The existing `TwistCan.tsx` and `Condensation.tsx` remain reusable; also copy `src/lib/flavours.ts` when moving them to another site.

## Localization and motion

Use the header's Arabic/EN switch. Language persists locally, changes document language/direction/title, and applies RTL layouts. Brand names in photographs remain part of the original artwork.

The motion button pauses automatic effects; device reduced-motion preferences are respected initially. Mobile has explicit rotation buttons and keeps vertical touch scrolling available. 3D stages mount near the viewport and unmount offscreen or while the page is hidden. A failed WebGL scene has an image fallback. The main JS and 3D renderer load as separate chunks. No remote HDRI is required.

## Verification

```sh
npm run check
npm run build
```

`check-site.mjs` server-renders both languages and validates 13 sections, explorer position, all downloads, local asset references, anchors, waypoint interpolation, and unchanged GLBs. `verification.json` records the results.

TypeScript and production builds pass. Browser visual, mobile layout, and live WebGL checks for this redesign could not be completed: the browser tool's automatic approval review rejected the local HTTP URL with a URL-policy error. These remain unverified; the static checks are not a substitute for a visual pass.

Original V2 model inspection predates this redesign. The model artwork is reconstructed from the user's references; the photographed shared back is unchanged.

## Implementation references

[GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) · [Motion for React](https://motion.dev/docs/react-installation) · [Lenis](https://github.com/darkroomengineering/lenis) · [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
