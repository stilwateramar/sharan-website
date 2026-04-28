const fs = require("fs");
const path = require("path");

function read(name) {
  const p = path.resolve(__dirname, "data", name);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

module.exports = {
  locations: () => read("locations.json"),
  products: () => read("products.json"),
  events: () => read("events.json"),
  recipes: () => read("recipes.json"),
  publications: () => read("publications.json"),
  experts: () => read("experts.json"),
  testimonials: () => read("testimonials.json")
};
