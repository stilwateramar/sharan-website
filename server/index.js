const path = require("path");
const express = require("express");
const cors = require("cors");

const newsletterRouter = require("./routes/newsletter");
const locationsRouter = require("./routes/locations");
const productsRouter = require("./routes/products");
const eventsRouter = require("./routes/events");
const recipesRouter = require("./routes/recipes");
const publicationsRouter = require("./routes/publications");
const cartRouter = require("./routes/cart");
const expertsRouter = require("./routes/experts");

const app = express();
app.use(cors());
app.use(express.json({ limit: "256kb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "sharan-india", time: new Date().toISOString() }));

app.use("/api/newsletter", newsletterRouter);
app.use("/api/locations", locationsRouter);
app.use("/api/products", productsRouter);
app.use("/api/events", eventsRouter);
app.use("/api/recipes", recipesRouter);
app.use("/api/publications", publicationsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/experts", expertsRouter);

// Static frontend served from repo root
const webroot = path.resolve(__dirname, "..");
app.use(express.static(webroot, { extensions: ["html"] }));
app.get("/", (_req, res) => res.sendFile(path.join(webroot, "index.html")));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: err.message });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`SHARAN India server running at http://localhost:${port}`);
});
