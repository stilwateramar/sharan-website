const express = require("express");
const data = require("../data");

const router = express.Router();

router.get("/", (req, res) => {
  const role = req.query.role;
  let list = data.experts();
  if (role) list = list.filter(e => (e.roles || []).includes(role));
  res.json({ ok: true, experts: list });
});

router.get("/testimonials", (_req, res) => {
  res.json({ ok: true, testimonials: data.testimonials() });
});

module.exports = router;
