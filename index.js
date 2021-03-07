const Koa = require("koa");
const Router = require("koa-router");
const json = require("koa-json");
const cors = require("@koa/cors");

const products = require("./data/products.json");

const app = new Koa();
const router = new Router();

const PORT = 8000;

app.use(json());
app.use(
  cors({
    origin: "*",
    allowedMethods: ["GET", "PUT", "POST", "DELETE"],
    exposeHeaders: ["X-Request-Id"],
  })
);

router.get("/products/:locationId", async (ctx) => {
  const { locationId = "" } = ctx.params;
  ctx.body = products[locationId];
});

router.get("/locations/options", async (ctx) => {
  ctx.body = Object.keys(products);
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(PORT, () => `Server started on port ${PORT}`);
