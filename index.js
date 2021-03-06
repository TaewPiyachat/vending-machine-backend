const Koa = require("koa");
const Router = require("koa-router");
const json = require("koa-json");

const app = new Koa();
const router = new Router();

const PORT = 8000;

app.use(json());

router.get("/test", async (ctx) => {
  ctx.body = 'Hello';
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(PORT, () => `Server started on port ${PORT}`);
