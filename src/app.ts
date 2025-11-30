import Koa from "koa";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import orderRoutes from "./routes/order.routes";

export function createServer(): Koa {
  const app = new Koa();

  // Middleware global de tratamento de erros
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err: any) {
      // Centraliza o tratamento de erros
      ctx.status = err.status || 500;
      ctx.body = {
        success: false,
        error: err.message || "Internal Server Error",
      };
      ctx.app.emit("error", err, ctx);
    }
  });

  // Body parser para ler JSON do request.body
  app.use(bodyParser());

  // Router principal que monta as rotas de /order
  const router = new Router();
  router.use("/order", orderRoutes.routes(), orderRoutes.allowedMethods());

  app.use(router.routes()).use(router.allowedMethods());

  return app;
}
