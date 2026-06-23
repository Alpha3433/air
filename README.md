# FÜM — "The Quit Pack" Landing Page

A standalone, responsive landing page that reproduces the FÜM **Quit Pack**
product page — same layout, section flow, colours, and styling — built with
plain HTML, CSS, and vanilla JavaScript. No build step, no dependencies.

> This is a **design demo**. It is not affiliated with FÜM and is not a live
> store. All copy, prices, and imagery are placeholders.

---

## Quick start

Just open the file in a browser:

```bash
# either double-click index.html, or serve it locally:
python3 -m http.server 8000
# then visit http://localhost:8000
```

## What's inside

```
index.html              # full page markup
assets/css/styles.css   # all styling + the brand palette (CSS variables)
assets/js/main.js       # plan selector, price math, accordion, gallery, reviews
assets/img/             # (drop real product/lifestyle images here)
```

## Sections (top → bottom)

1. Marquee announcement bar
2. Sticky header + nav + fixed "Mystery Gift" side tab
3. Product hero — image gallery + buy box (plan selector, refill add-on, ATC, accordion)
4. "Watch Before You Buy" video
5. "Your Pack Includes…" checklist + gold *Welcome to the Good Side* box
6. Lifestyle banner
7. Features triptych (Chewable / Flavor / Fidgety / Distraction) + "Stop Ignoring the Habit"
8. "No Batteries or Vapor?" diagram
9. "Not Quitting Is Too Expensive" cost comparison (dark navy)
10. "Quit Vaping for Good"
11. UGC photo strip
12. "We're here to stick with you. Not to your lungs."
13. "Trusted by 1 Million+ Happy Customers" reviews
14. Final CTA + footer

## Brand palette

All colours live as CSS variables at the top of `assets/css/styles.css`:

| Token | Hex | Use |
|---|---|---|
| `--cream` | `#F4EEE3` | page background |
| `--forest` | `#3C4A37` | primary CTA / brand green |
| `--sage` | `#93A579` | side tab, accents |
| `--gold` | `#EDB836` | "good side" box, badges |
| `--navy` | `#15273B` | cost / footer sections |
| `--blue` | `#2E6BE6` | "Not to your lungs" accent |
| `--rasp` | `#DB5C84` | raspberry highlight |

Change the whole look by editing those variables.

## Swapping in real images

The coloured blocks are placeholders driven by `.ph` classes (see the
*PLACEHOLDER IMAGE SYSTEM* block in the CSS). To use real photos, either:

- set a `background-image` on the relevant `.ph--*` class, or
- replace the `<div class="ph …">` with an `<img>` and remove the `ph` class.

## Porting to Shopify (later)

This page is plain HTML, so it's easy to move into Shopify:

- Paste the markup into a **Custom Liquid** section/block, or a page built
  with a section-based theme, and move `styles.css` / `main.js` into the
  theme's `assets/` (reference them with `{{ 'styles.css' | asset_url | stylesheet_tag }}`).
- Replace the hard-coded plan prices with Shopify variant data
  (`{{ product.variants }}`) and wire the **Add to Cart** button to
  `/cart/add` or the Ajax Cart API.
- Convert the editable text/images into section `schema` settings so they're
  editable from the theme customizer.

Ask and I can generate the `sections/quit-pack.liquid` version next.
