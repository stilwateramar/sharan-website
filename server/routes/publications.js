const express = require("express");
const data = require("../data");

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({ ok: true, publications: data.publications() });
});

router.get("/:slug", (req, res) => {
  const p = data.publications().find(x => x.slug === req.params.slug);
  if (!p) return res.status(404).json({ ok: false, error: "Publication not found." });
  res.json({ ok: true, publication: p });
});

module.exports = router;
