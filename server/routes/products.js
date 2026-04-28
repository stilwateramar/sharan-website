const express = require("express");
const data = require("../data");

const router = express.Router();

function allProducts() {
  const p = data.products();
  const events = data.events().map(e => ({
    slug: e.slug,
    title: e.title,
    type: "event",
    eventCategory: e.category,
    eventLocation: e.location,
    price: e.price,
    earlyBird: e.earlyBird || null,
    free: !!e.free,
    image: e.image,
    description: e.summary,
    startDate: e.startDate,
    endDate: e.endDate,
    status: e.status
  }));
  const publications = data.publications().map(b => ({
    slug: b.slug,
    title: b.title,
    type: "publication",
    price: b.price,
    image: b.image,
    description: b.description,
    pdfUrl: b.pdfUrl || null,
    available: { print: !!b.printAvailable, pdf: !!b.pdfAvailable }
  }));
  return [...p.consultations.map(c => ({ ...c, type: "consultation" })), ...events, ...publications];
}

router.get("/", (req, res) => {
  const { type, consultType } = req.query;
  let list = allProducts();
  if (type) list = list.filter(p => p.type === type);
  if (type === "consultation" && consultType) {
    list = list.filter(p => Array.isArray(p.consultType) && p.consultType.includes(String(consultType)));
  }
  res.json({ ok: true, total: list.length, products: list });
});

router.get("/:slug", (req, res) => {
  const p = allProducts().find(x => x.slug === req.params.slug);
  if (!p) return res.status(404).json({ ok: false, error: "Product not found." });
  res.json({ ok: true, product: p });
});

module.exports = router;
