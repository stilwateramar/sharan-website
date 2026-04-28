const fs = require("fs");
const path = require("path");

const file = path.resolve(__dirname, "data/runtime.json");
let state = null;

function load() {
  if (state) return state;
  if (fs.existsSync(file)) {
    try { state = JSON.parse(fs.readFileSync(file, "utf8")); }
    catch (_) { state = null; }
  }
  if (!state) {
    state = { subscribers: [], orders: [], carts: {}, nextSubscriberId: 1, nextOrderId: 1 };
  }
  return state;
}

function save() {
  if (!state) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(state, null, 2));
}

function subscribers() { return load().subscribers; }
function orders() { return load().orders; }
function carts() { return load().carts; }

function nextId(kind) {
  const s = load();
  const key = kind === "order" ? "nextOrderId" : "nextSubscriberId";
  const id = s[key]++;
  save();
  return id;
}

module.exports = { load, save, subscribers, orders, carts, nextId };
