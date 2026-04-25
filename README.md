# SHARAN India — modern site rebuild

A static, modern rebuild of [sharan-india.org](https://sharan-india.org) — the public site of SHARAN (Sanctuary for Health and Reconnection to Animals and Nature), a non-profit founded by Dr. Nandita Shah in 2005.

## What this is

Plain HTML, CSS and a tiny JS file. No build step required. Open `index.html` in a browser, or serve the folder with any static server.

```
python3 -m http.server 4000
# then visit http://localhost:4000
```

## Pages

- `index.html` — Home
- `about.html` — About SHARAN
- `programs.html` — Programs overview
  - `diabetes-reversal.html`
  - `hypertension-reversal.html`
  - `weight-release.html`
  - `healthy-cooking.html`
- `workshops.html` — Workshops, talks, public events
- `retreats.html` — Residential retreats
- `books.html` — Books and reading
- `team.html` — Doctors and team
- `blog.html` — Articles
- `contact.html` — Contact form
- `donate.html` — Support SHARAN

## Important: copy is placeholder

This rebuild was assembled without direct network access to the live `sharan-india.org` site. The structure, navigation and visual design are in place, but every page contains **placeholder copy** written from publicly known facts about SHARAN (founding year, founder, programs, mission). Before going live:

1. Replace the body copy on each page with the verbatim text from the live site.
2. Add real testimonials and remove the "(illustrative)" tags on quotes.
3. Add real team members and bios on `team.html`.
4. Add real book titles, covers and purchase links on `books.html`.
5. Drop in the real blog posts, dates and author names on `blog.html`.
6. Wire the contact form to a real backend (Formspree, Netlify Forms, custom endpoint).
7. Add live donation links, account details and 80G information on `donate.html`.

There are no images yet — placeholders use CSS gradient panels labeled with what should go there. Add real photographs to `assets/img/` and replace the `<div class="visual">` panels with `<img>` tags.

## Editing pages

Each page is generated from a small template + per-page body file:

- `_template.html` — the shared shell (head, nav, footer)
- `_pages/*.body` — first line = page title, second line = meta description, rest = page body HTML
- `_build.sh` — regenerates the `*.html` files

To rebuild after editing:

```
bash _build.sh
```

You can also edit `index.html`, `about.html` and `programs.html` directly — those are written by hand, not generated.

## Design system

Colors, type and spacing live in CSS variables at the top of `assets/css/style.css`. The palette is forest green + warm cream + earth accent, intended to feel modern, calm and natural. Typography pairs Inter (sans) with Fraunces (display serif) — both via Google Fonts.

## License & content rights

Code in this repo: free to use under the repo's license.

The substantive content (program names, organisational name, descriptions of approach) refers to the SHARAN organisation. Use of those references on a public site should only be done with SHARAN's permission.
