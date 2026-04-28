# SHARAN India backend

A small Node/Express service that powers the dynamic parts of the SHARAN India website replica:

- Newsletter subscription (with WhatsApp opt-in step and the WhatsApp group join URL)
- Country / state / city cascade for the newsletter form
- Products (consultations, events, publications) with filtering by type and `consultType=new|return`
- Events with location/category filters, paginated infinite-scroll, badges (Free / Early Bird / Ongoing)
- Recipes search (autocomplete) and category listings
- Publications and a sample cart + checkout flow
- Experts directory + testimonials

No database server is required — catalog data lives in `data/*.json`, runtime data (subscribers, carts, orders) is persisted to `data/runtime.json`.

## Run

```bash
cd server
npm install
npm run dev    # or: npm start
# Server + static frontend at http://localhost:4000
```

The Express app also serves the repo root as static HTML, so the same port serves the website and the API.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Liveness check. |
| POST | `/api/newsletter/subscribe` | Step 1: name, email, country, state, city, recaptchaToken. Returns `status: new|existing`. |
| POST | `/api/newsletter/whatsapp` | Step 2: subscriberId, optIn, countryCode, number. Returns the WhatsApp group URL on opt-in. |
| GET | `/api/locations/countries` | List of countries with dial codes. |
| GET | `/api/locations/states?country=IN` | States in a country. |
| GET | `/api/locations/cities?country=IN&state=MH` | Cities in a state. |
| GET | `/api/products?type=consultation&consultType=new` | Filterable product list. |
| GET | `/api/products/:slug` | Single product. |
| GET | `/api/events?location=mumbai&category=reversing-diabetes&page=1` | Events with badges and counts. |
| GET | `/api/recipes/search?q=quinoa` | Autocomplete results. |
| GET | `/api/recipes/categories` | 15 recipe categories with counts. |
| GET | `/api/recipes/category/:slug` | Recipes in a category. |
| GET | `/api/publications` | All 8 publications. |
| GET | `/api/experts?role=doctor` | Experts directory. |
| POST | `/api/cart` → `/:id/items` → `/:id/checkout` | WooCommerce-style cart → checkout. |

The WhatsApp group URL is hard-coded to `https://chat.whatsapp.com/G5fn0NknK5U7AiPRUOK0Xz` per the BRD. The reCAPTCHA token is accepted as opaque — swap in Google's verification call before going live.
