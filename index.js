const Koa = require("koa");
const Router = require("koa-router");
const BodyParser = require("koa-bodyparser");
const json = require("koa-json");
const cors = require("@koa/cors");

const products = require("./data/products.json");

const app = new Koa();
const router = new Router();

const { loadJSON, saveJSON } = require("./utils");

const PORT = 8000;

app.use(BodyParser());
app.use(json());
app.use(cors());

router.post("/login", async (ctx) => {
  const { username, password } = ctx.request.body;

  if (username === "admin" && password === "admin") {
    ctx.body = { status: 200, isAuthentication: true };
  } else {
    ctx.body = {
      status: 403,
      isAuthentication: false,
      message: "Email or Password is incorrect.",
    };
  }
});

router.get("/notifications", async (ctx) => {
  const values = Object.values(loadJSON("./data/products.json"));
  const data = [].concat.apply([], values);
  const filteredValues = data.filter((d) => d.quantity < 10);
  ctx.body = { status: 200, data: filteredValues };
});

router.get("/products", async (ctx) => {
  ctx.body = {
    status: 200,
    data: products,
  };
});

router.get("/products/:locationId", async (ctx) => {
  const { locationId = "" } = ctx.params;
  ctx.body = products[locationId];
});

router.put("/products/buy/:locationId/:productId", async (ctx) => {
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

  ctx.body = {
    status: 200,
    data: products,
    notifyAdmin: products[idx].quantity < 10,
  };
});

router.put("/products/add/:locationId/:productId", async (ctx) => {
  const { amount } = ctx.request.body;
  const { locationId = "", productId = "" } = ctx.params;

  const data = { ...loadJSON("./data/products.json") };
  const products = [...data[locationId]];
  const idx = products.findIndex((p) => p.id === productId);
  const prevQuantity = products[idx].quantity;
  const modifiedProduct = {
    ...products[idx],
    quantity: !products[idx].quantity ? 0 : products[idx].quantity + amount,
  };
  products.splice(idx, 1, modifiedProduct);
  const modifiedData = { ...data, [locationId]: products };
  saveJSON("./data/products.json", modifiedData);

  ctx.body = {
    status: 200,
    data: modifiedData,
    notifyAdmin: prevQuantity < 10 && products[idx].quantity >= 10,
  };
});

router.get("/locations/options", async (ctx) => {
  ctx.body = Object.keys(products);
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(PORT, () => `Server started on port ${PORT}`);
