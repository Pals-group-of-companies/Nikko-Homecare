# Nikko Homecare website

The official website for **Nikko Homecare**, home nursing, elderly care and a care residence in Karen, Nairobi.
Live domain: **https://nikkohomecare.co.ke**

A fast, static website: plain HTML, CSS and JavaScript, with no build step and no database. It works on any static host and is set up for **GitHub Pages**.

## What's included

| Page | Path |
|---|---|
| Home | `/` |
| About | `/about-us/` |
| Services (interactive explorer, 12 services) | `/services/` |
| Our residence (tabs, visit request form, gallery) | `/our-residence/` |
| Contact (consultation form, Google Map) | `/contact/` |
| Blog and two articles | `/blog/`, `/does-my-loved-one-need-home-based-care/`, `/dementia-patients-to-pursue-home-health-care-or-assisted-living/` |
| Privacy policy, Terms of service, Cookie policy | `/privacy-policy/`, `/terms-of-service/`, `/cookie-policy/` |
| Not-found page | `404.html` |
| Redirects from old URLs | `/gallery/`, `/faq/`, `/about/`, `/our-services/` |

Built in: mobile menu, cookie banner (Google Maps only loads after consent), count-up statistics, accessible tabs and accordions, form handling, SEO meta tags, Open Graph previews, Schema.org structured data, `sitemap.xml`, `robots.txt` (search engines and AI assistants allowed) and `llms.txt`.

## Publish with GitHub Pages

1. In this repository go to **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
3. After a minute the site is live at `https://pals-group-of-companies.github.io/Nikko-Homecare/`.

### Connect nikkohomecare.co.ke

Do this when you are ready to replace the current WordPress site.

1. In **Settings → Pages → Custom domain**, enter `nikkohomecare.co.ke` and save. GitHub adds a `CNAME` file to the repository.
2. At your domain registrar, replace the existing records with:
   - `A` records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`
   - a `CNAME` record for `www` pointing to `pals-group-of-companies.github.io`
3. Wait for DNS to update (up to 24 hours), then tick **Enforce HTTPS** in Settings → Pages.

Note: the 404 page uses links from the site root, so it looks correct once the custom domain is connected.

## Settings to complete before launch

All in `assets/js/main.js`, at the top in `CONFIG`:

- **Forms.** Create a form at [formspree.io](https://formspree.io) using care@nikkohomecare.co.ke, then paste the form ID into `formEndpoint`. Until then, the forms open the visitor's email app with their message filled in, so no enquiry is lost.
- **Social media.** Paste the Facebook, Instagram and X profile links into `social`. Icons appear in the footer automatically; empty ones stay hidden.

Also:
- Replace `assets/img/nikko-homecare-logo.png` with the original high-resolution logo (same file name).
- Have the legal pages reviewed by a Kenyan advocate, and check whether registration with the Office of the Data Protection Commissioner is required.

## After launch

1. Add the site to **Google Search Console** and **Bing Webmaster Tools** and submit `https://nikkohomecare.co.ke/sitemap.xml`.
2. Claim and complete the **Google Business Profile** (category: Home health care service), using exactly the same name, address and phone number as the website.
3. Ask families for Google reviews and publish one helpful blog article a month.

## Editing the site

Each page is a self-contained `index.html` in its own folder. Shared styles are in `assets/css/styles.css` and shared behaviour in `assets/js/main.js`. The header and footer are repeated on every page, so update them on every page when they change.

Images live in `assets/img/` as WebP. Keep new photos under about 200 KB, give them descriptive file names, and always write alt text.
