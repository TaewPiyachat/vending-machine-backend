const Koa = require("koa");
const Router = require("koa-router");
const json = require("koa-json");
const cors = require("@koa/cors");

const products = require("./data/products.json");

const app = new Koa();
const router = new Router();

const { loadJSON, saveJSON } = require("./utils");

const PORT = 8000;

app.use(json());
app.use(cors());

router.get("/products/:locationId", async (ctx) => {
  const { locationId = "" } = ctx.params;
  ctx.body = products[locationId];
});

router.put("/products/:locationId/:productId", async (ctx) => {
  const { locationId = "", productId = "" } = ctx.params;
  const data = { ...loadJSON("./data/products.json") };
  const products = [...data[locationId]];
  const idx = products.findIndex((p) => p.id === productId);
  const modifiedProduct = {
    ...products[idx],
    quantity: !products[idx].quantity ? 0 : products[idx].quantity - 1,
  };
  products.splice(idx, 1, modifiedProduct);
  const modifiedData = { ...data, [locationId]: products };
  saveJSON("./data/products.json", modifiedData);
  ctx.body = { status: 200, data: products };
});

router.get("/locations/options", async (ctx) => {
  ctx.body = Object.keys(products);
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(PORT, () => `Server started on port ${PORT}`);
