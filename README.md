# FÜM — "Journey Pack" Landing Page

A standalone, responsive landing page that reproduces the FÜM **Journey Pack**
product page — same layout, section flow, colours, and typography — built with
plain HTML, CSS, and vanilla JavaScript. No build step, no dependencies.

> Design demo. Not affiliated with FÜM and not a live store. Copy, prices, and
> imagery are placeholders modeled on the real page.

---

## Quick start

```bash
# double-click index.html, or serve locally:
python3 -m http.server 8000   # → http://localhost:8000
```

## Files

```
index.html              # full page markup
assets/css/styles.css   # brand palette (CSS variables) + all styling
assets/js/main.js       # configurator, price math, gallery, reviews
assets/img/             # drop real product / lifestyle / review photos here
```

## Sections (top → bottom)

1. Marquee announcement bar (Free Shipping · Save 30% · Guarantee)
2. Sticky header — left nav (Journey Pack · Cores Club · Shop All · Science · Find a store · Blog), centered FÜM logo, cart
3. **Product hero** — image gallery + buy-box **configurator**:
   - Step 1: device (Prominent / Solano +$30 / Quit Together +$104)
   - Step 2: flavor cores grid — pick 3 (gates the Add-to-Cart button)
   - Step 3: optional accessories
   - One-time vs **Subscribe & Save 30%**, live total
4. Dark-green feature strip (Rewires Habits · Keeps Hands Busy · Zero Nicotine · No Vapor · Use Anywhere)
5. "Your Pack Includes…" + lemon *Welcome to the Good Side* box
6. Lifestyle banner
7. Features triptych (Chewable / Flavor / Fidgety / Distraction) + "Stop *Ignoring* the Habit"
8. "No Batteries or Vapor?" — mint section with cutaway diagram
9. Split row: "Quit Vaping for Good" + teal "Not Quitting Is Too Expensive" ($2,000 / $800 / $150)
10. UGC photo grid
11. "We're here to stick with you. Not to your lungs."
12. "Trusted by 1 Million+ Happy Customers" reviews (4,225)
13. Final CTA + footer (newsletter, nav, patent line, Design by note)

## Brand palette (lifted from the real page)

CSS variables at the top of `assets/css/styles.css`:

| Token | Hex | Use |
|---|---|---|
| `--forest` | `#3f603f` | primary CTA / brand green |
| `--teal` | `#416157` | dark cost section |
| `--ink` | `#131313` | header text / footer |
| `--cream` | `#fdfcf5` | page background |
| `--lemon` | `#f7f782` | "good side" box, subscribe CTA |
| `--lime` | `#f0f5d7` | configurator panel |
| `--mint` | `#c3e1d8` | "no batteries" section |
| `--peach` | `#fdd7b6` | warm accent panels |
| `--red` | `#ff2b49` | sale badges |

**Fonts:** [Lexend](https://fonts.google.com/specimen/Lexend) (primary) +
[Lekton](https://fonts.google.com/specimen/Lekton) (mono labels/specs) — the
same families the real site uses, loaded from Google Fonts with system
fallbacks.

## Swapping in real images

The coloured blocks are placeholders driven by `.ph--*` classes (see the
*PLACEHOLDER IMAGE SYSTEM* block in the CSS). Set a `background-image` on the
relevant class, or replace the `<div class="ph …">` with an `<img>`.

## Porting to Shopify

Plain HTML, so it moves cleanly into a theme:

- Paste markup into a **Custom Liquid** section/block; move `styles.css` /
  `main.js` into the theme's `assets/` and reference with
  `{{ 'styles.css' | asset_url | stylesheet_tag }}`.
- Replace the hard-coded device/accessory prices with Shopify variant data
  (`{{ product.variants }}`) and wire **Add to Cart** to the Ajax Cart API.
  The "pick 3 cores" gating maps to a line-item-property / bundle app.
- Expose editable text/images via section `schema` settings for the customizer.

Ask and I can generate the `sections/journey-pack.liquid` version next.

## Verified behavior

Run in a headless DOM (jsdom) — 19/19 checks pass:
device price changes, accessory add-ons, subscribe 30% discount, the
choose-3-cores gating (incl. bumping the oldest pick on a 4th), live ATC
total, cart counter, gallery swap, reviews load-more, and mobile nav — with
zero JS runtime errors. A pixel screenshot couldn't be generated here because
the sandbox blocks browser-binary downloads.
