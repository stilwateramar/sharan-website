const express = require("express");
const data = require("../data");

const router = express.Router();

function badge(event) {
  if (event.free) return { kind: "free", label: "Free" };
  if (event.earlyBird && event.earlyBird.endDate) {
    const end = new Date(event.earlyBird.endDate);
    if (end > new Date()) return { kind: "earlybird", label: "Early Bird", endDate: event.earlyBird.endDate, price: event.earlyBird.price };
  }
  if (event.status === "ongoing") return { kind: "ongoing", label: "Ongoing" };
  return null;
}

router.get("/", (req, res) => {
  const all = data.events();
  const { location, category, q, page = 1, perPage = 12 } = req.query;
  let list = all.slice();
  if (location && location !== "all") list = list.filter(e => e.location === location);
  if (category && category !== "all") list = list.filter(e => e.category === category);
  if (q) {
    const needle = String(q).toLowerCase();
    list = list.filter(e => e.title.toLowerCase().includes(needle) || (e.summary || "").toLowerCase().includes(needle));
  }
  const total = list.length;
  const p = Math.max(1, parseInt(page, 10) || 1);
  const pp = Math.min(50, parseInt(perPage, 10) || 12);
  const start = (p - 1) * pp;
  const items = list.slice(start, start + pp).map(e => ({ ...e, badge: badge(e) }));

  // Counts per category — for the events page sidebar
  const counts = all.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + 1; return acc; }, {});

  res.json({ ok: true, total, page: p, perPage: pp, hasMore: start + pp < total, events: items, counts });
});

router.get("/:slug", (req, res) => {
  const e = data.events().find(x => x.slug === req.params.slug);
  if (!e) return res.status(404).json({ ok: false, error: "Event not found." });
  res.json({ ok: true, event: { ...e, badge: badge(e) } });
});

module.exports = router;
