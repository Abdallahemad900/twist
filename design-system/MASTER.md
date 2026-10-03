# Twist / Blueberry Island

## Direction
Product-first editorial campaign. Baby blue and deep berry navy from the supplied can references, with off-white breaks between immersive sequences. Large condensed Latin display type, italic accents, and Cairo for Arabic. Generous space, small section counters, strong edges, and functional controls.

UI UX Pro Max was installed from `nextlevelbuilder/ui-ux-pro-max-skill` and queried for beverage/product and 3D showcase design systems. The useful match was Scroll-Triggered Storytelling: complete DOM reading order, reduced-motion alternatives, progress indication, and motion paused offscreen. Its generic orange/grey palettes were not adopted because the user explicitly requested a baby-blue brand focus.

## Tokens
- Ink: #102a40; navy: #0b1a32
- Baby blue: #88d9e7; paper: #f1f3ed
- Body: Arial / Cairo Variable. Display: Barlow Condensed 600/700/800 italic; Cairo Variable 800 for Arabic.
- Spacing: 6vw page gutters (5vw at intermediate widths), 76/90/112px section spacing.
- Responsive: desktop, 1100px, 760px, 390px breakpoints; no hover-only controls.

## Motion
- GSAP + ScrollTrigger: text illumination, frost uniform, bento scrubbing, camera waypoints, footer elastic entrance.
- Motion for React (formerly Framer Motion): hero entrance, SVG flavor morph, content transitions, pointer tilt.
- Lenis: one GSAP-ticker-driven smooth-scroll instance, with anchor offsets and cleanup.
- R3F: existing GLBs, instanced water, floating berries, can rotation. Render only nearby visible stages; suspend when the document is hidden.
- Reduced motion: native scrolling, still scenes, no auto-rotation or parallax; manual flavor and rotation controls remain available.

## Content
13 ordered main sections, plus footer. The collection explorer is section 5. English and Egyptian Arabic share complete content with RTL layout. No fabricated stockists, nutrition claims, testimonials, purchasing flows, or contact forms.
