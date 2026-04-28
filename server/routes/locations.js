const express = require("express");
const data = require("../data");

const router = express.Router();

router.get("/countries", (_req, res) => {
  const list = data.locations().countries.map(c => ({ code: c.code, name: c.name, dialCode: c.dialCode }));
  res.json({ ok: true, countries: list });
});

router.get("/states", (req, res) => {
  const country = String(req.query.country || "").toUpperCase();
  const c = data.locations().countries.find(x => x.code === country);
  if (!c) return res.json({ ok: true, states: [] });
  res.json({ ok: true, states: (c.states || []).map(s => ({ code: s.code, name: s.name })) });
});

router.get("/cities", (req, res) => {
  const country = String(req.query.country || "").toUpperCase();
  const stateCode = String(req.query.state || "");
  const c = data.locations().countries.find(x => x.code === country);
  if (!c) return res.json({ ok: true, cities: [] });
  const s = (c.states || []).find(x => x.code === stateCode || x.name === stateCode);
  if (!s) return res.json({ ok: true, cities: [] });
  res.json({ ok: true, cities: (s.cities || []).map(name => ({ name })) });
});

module.exports = router;
