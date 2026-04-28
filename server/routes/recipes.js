const express = require("express");
const data = require("../data");

const router = express.Router();

router.get("/categories", (_req, res) => {
  const list = data.recipes().categories;
  const recipes = data.recipes().recipes;
  const counts = recipes.reduce((acc, r) => { acc[r.category] = (acc[r.category] || 0) + 1; return acc; }, {});
  res.json({ ok: true, categories: list.map(c => ({ ...c, count: counts[c.slug] || 0 })) });
});

router.get("/category/:slug", (req, res) => {
  const recipes = data.recipes().recipes.filter(r => r.category === req.params.slug);
  res.json({ ok: true, total: recipes.length, recipes });
});

router.get("/search", (req, res) => {
  const q = String(req.query.q || "").toLowerCase().trim();
  if (!q) return res.json({ ok: true, results: [] });
  const results = data.recipes().recipes
    .filter(r => r.title.toLowerCase().includes(q) || (r.tags || []).some(t => t.toLowerCase().includes(q)) || (r.summary || "").toLowerCase().includes(q))
    .slice(0, 10)
    .map(r => ({ slug: r.slug, title: r.title, category: r.category, image: r.image }));
  res.json({ ok: true, results });
});

router.get("/:slug", (req, res) => {
  const r = data.recipes().recipes.find(x => x.slug === req.params.slug);
  if (!r) return res.status(404).json({ ok: false, error: "Recipe not found." });
  res.json({ ok: true, recipe: r });
});

module.exports = router;
