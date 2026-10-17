# Zaw Lin Naing / Norman Linn — Aviation × Software

A responsive portfolio combining the original GitHub portfolio's portrait, identity card, dark mode, skills grid, and Framer Motion interactions with the real project stories from the Norman Linn portfolio.

Featured projects: **LAXCommute**, **Settle**, and **Burman Tea**. Burman Tea is labelled as a project in development; no operational store or payment-readiness claims are made. The contact action links to the public GitHub profile.

## Development

Run `npm ci`, then `npm run build`. The build checks TypeScript, bundles `src/script.ts` and `src/motion.ts`, and copies `dist/` to `docs/` for the existing GitHub Pages workflow.

Public portfolio: https://normanlinn.github.io/portfolio/

## Structure

- `dist/index.html`: semantic page content and accessible project story dialog.
- `dist/style.css`, `dist/redesign.css`, `dist/merge.css`: the retained design system, merged art direction, local typography, and responsive layouts.
- `src/script.ts`: theme, accessible project stories, identity card, skill filters, portrait, and navigation.
- `src/routes.ts`: interactive illustrated route selection with reduced-motion support.
- `src/motion.ts`: retained Framer Motion entrances, hover feedback, scroll progress, and reduced-motion cleanup.
- `src/cursor.ts`: retained desktop pointer enhancement; native touch and keyboard behavior remain available.
- `dist/assets/`: fonts, favicon, and social preview.
- `.openai/hosting.json`: persistent Site identity and static output configuration.

The shuttle illustration is a labelled, non-geographic concept sketch. It makes no live location or arrival-time claims. Actual shuttle information is accessed through the linked LAXCommute app.

Source content is grounded in the user's supplied identity, project sources, aviation experience, and coursework. No private contact data is included. Portraits are retained from the original GitHub repository; the hero image is AI-assisted. Local fonts retain their accompanying license.
