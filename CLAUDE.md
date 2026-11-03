# Notes for Claude Code

This repository is the static website for Nikko Homecare (nikkohomecare.co.ke), hosted on GitHub Pages from the `main` branch root.

- Plain HTML/CSS/JS. No framework, no build step. Each page is `folder/index.html`; links between pages are relative (`../services/`).
- Shared styles: `assets/css/styles.css` (design tokens in `:root`). Shared behaviour: `assets/js/main.js` (`CONFIG` at the top holds the form endpoint and social links).
- Header, footer and cookie banner are repeated in every page. When changing them, change every HTML file.
- Brand: navy `#0E1033`, accent `#CC4419`, font Plus Jakarta Sans. Minimal, photo-led design; no stock icons, no small "eyebrow" labels above headings.
- Copy rules: never use the word "free"; the main call to action is "Book a consultation"; hours are "Always open"; founder is Alice Gachui; 10+ years of experience.
- Every new page needs: unique `<title>` and meta description, canonical URL, Open Graph tags, one `<h1>`, alt text on images, and an entry in `sitemap.xml` (and `llms.txt` if it is a main page).
- Images: WebP in `assets/img/`, with `width`/`height` attributes and `loading="lazy"` below the fold.
