const express = require("express");
const crypto = require("crypto");
const store = require("../store");
const data = require("../data");

const router = express.Router();

function findProduct(slug) {
  const p = data.products();
  const c = p.consultations.find(x => x.slug === slug);
  if (c) return { ...c, type: "consultation" };
  const e = data.events().find(x => x.slug === slug);
  if (e) return { slug: e.slug, title: e.title, price: e.price, type: "event", image: e.image };
  const b = data.publications().find(x => x.slug === slug);
  if (b) return { slug: b.slug, title: b.title, price: b.price, type: "publication", image: b.image };
  return null;
}

function loadCart(cartId) {
  const carts = store.carts();
  if (!carts[cartId]) carts[cartId] = { id: cartId, items: [], createdAt: new Date().toISOString() };
  return carts[cartId];
}

router.post("/", (req, res) => {
  const id = crypto.randomBytes(8).toString("hex");
  loadCart(id);
  store.save();
  res.json({ ok: true, cartId: id });
});

router.get("/:id", (req, res) => {
  const cart = store.carts()[req.params.id];
  if (!cart) return res.status(404).json({ ok: false, error: "Cart not found." });
  res.json({ ok: true, cart });
});

router.post("/:id/items", (req, res) => {
  const { slug, quantity = 1 } = req.body || {};
  const product = findProduct(slug);
  if (!product) return res.status(404).json({ ok: false, error: "Product not found." });
  const cart = loadCart(req.params.id);
  const existing = cart.items.find(i => i.slug === slug);
  if (existing) existing.quantity += Number(quantity) || 1;
  else cart.items.push({ slug, title: product.title, image: product.image, price: product.price, type: product.type, quantity: Number(quantity) || 1 });
  store.save();
  res.json({ ok: true, cart });
});

router.delete("/:id/items/:slug", (req, res) => {
  const cart = loadCart(req.params.id);
  cart.items = cart.items.filter(i => i.slug !== req.params.slug);
  store.save();
  res.json({ ok: true, cart });
});

router.post("/:id/checkout", (req, res) => {
  const { customerName, customerEmail, billingAddress, currency = "INR" } = req.body || {};
  const cart = store.carts()[req.params.id];
  if (!cart || !cart.items.length) return res.status(400).json({ ok: false, error: "Your cart is empty." });
  if (!customerName || !customerEmail) return res.status(400).json({ ok: false, error: "Name and email are required." });

  const total = cart.items.reduce((sum, i) => sum + ((i.price && i.price[currency]) || 0) * i.quantity, 0);
  const orderNumber = `SH-${Date.now().toString(36).toUpperCase()}`;
  const order = {
    id: store.nextId("order"),
    orderNumber,
    customerName,
    customerEmail,
    billingAddress: billingAddress || null,
    currency,
    total,
    items: cart.items,
    status: "paid",
    createdAt: new Date().toISOString()
  };
  store.orders().push(order);
  // Empty cart
  cart.items = [];
  store.save();
  res.json({ ok: true, order });
});

module.exports = router;
