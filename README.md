# ZR Technologies — Next.js Upgrade

This project rebuilds the supplied ZR Technologies landing page using:
- Next.js + React
- Tailwind CSS (configured and available for utility classes)
- GSAP + ScrollTrigger
- Three.js
- Lenis smooth scrolling

Bootstrap and Vue are intentionally not included: Bootstrap duplicates the styling role of Tailwind, while Vue is an alternative framework to React/Next.js. Adding all of them to one small landing page would increase complexity without a clear benefit.

## Run locally
1. Install Node.js (LTS).
2. Extract this ZIP.
3. In the project folder run `npm install`.
4. Run `npm run dev`.
5. Open `http://localhost:3000`.

## Before publishing
- In `app/page.jsx`, replace `923000000000` with the real WhatsApp number in international format, digits only.
- Replace the illustrative metrics with verified company figures.
- Test the WhatsApp form, navigation and responsive layout on mobile.
- Run `npm run build` before deployment.

## Deploy
This is a Next.js app. Deploy to a Next.js-compatible host such as Vercel, or configure Cloudflare Pages/Workers using the appropriate Next.js adapter/runtime. A static export may require adapting server-dependent Next.js features if added later.


## Cloudflare Pages (browser-based GitHub deployment)

This project is configured for Next.js static export. In Cloudflare Pages, connect the GitHub repository and use:
- Framework preset: Next.js (Static HTML Export)
- Build command: `npx next build`
- Build output directory: `out`

The project must be built by Cloudflare before it can be served. Uploading this source ZIP directly as a prebuilt Pages asset will not work.
