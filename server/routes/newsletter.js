const express = require("express");
const store = require("../store");

const router = express.Router();

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/G5fn0NknK5U7AiPRUOK0Xz";

function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "")); }

// Step 1: name + email + country/state/city
router.post("/subscribe", (req, res) => {
  const { fullName, email, country, state, city, language, recaptchaToken } = req.body || {};
  if (!fullName || !validEmail(email)) {
    return res.status(400).json({ ok: false, error: "Please provide a full name and a valid email address." });
  }
  if (!recaptchaToken) {
    // In production, verify with Google reCAPTCHA. We accept the presence of a token here.
    return res.status(400).json({ ok: false, error: "Please complete the reCAPTCHA challenge." });
  }

  const subs = store.subscribers();
  const normalized = String(email).toLowerCase().trim();
  const existing = subs.find(s => s.email === normalized);

  if (existing) {
    return res.json({
      ok: true,
      status: "existing",
      subscriberId: existing.id,
      whatsappOptedIn: !!existing.whatsappOptedIn,
      message: "You are already subscribed to the SHARAN newsletter. You can update your WhatsApp preference below."
    });
  }

  const id = store.nextId("subscriber");
  subs.push({
    id,
    fullName,
    email: normalized,
    country: country || null,
    state: state || null,
    city: city || null,
    language: language || "en",
    whatsappOptedIn: false,
    whatsappCountryCode: null,
    whatsappNumber: null,
    createdAt: new Date().toISOString()
  });
  store.save();
  res.json({ ok: true, status: "new", subscriberId: id });
});

// Step 2: WhatsApp opt-in
router.post("/whatsapp", (req, res) => {
  const { subscriberId, optIn, countryCode, number } = req.body || {};
  const subs = store.subscribers();
  const s = subs.find(x => x.id === Number(subscriberId));
  if (!s) return res.status(404).json({ ok: false, error: "Subscriber not found." });

  s.whatsappOptedIn = !!optIn;
  s.whatsappCountryCode = optIn ? (countryCode || null) : null;
  s.whatsappNumber = optIn ? (number || null) : null;
  s.updatedAt = new Date().toISOString();
  store.save();

  res.json({
    ok: true,
    whatsappGroupUrl: optIn ? WHATSAPP_GROUP_URL : null
  });
});

router.get("/_subscribers", (_req, res) => {
  // Admin-style endpoint, kept simple for the replica build. In production, gate behind auth.
  res.json({ ok: true, total: store.subscribers().length });
});

module.exports = router;
