// src/routes/order.routes.ts
import Router from "koa-router";
import {
  createOrderHandler,
  getOrderHandler,
  listOrdersHandler,
  updateOrderHandler,
  deleteOrderHandler,
} from "../controllers/order.controller";

const router = new Router();

// Criar um novo pedido (POST /order)
router.post("/", createOrderHandler);

// Listar pedidos (GET /order/list)
router.get("/list", listOrdersHandler);

// Obter pedido por orderId (GET /order/:id)
router.get("/:id", getOrderHandler);

// Atualizar pedido (PUT /order/:id)
router.put("/:id", updateOrderHandler);

// Deletar pedido (DELETE /order/:id)
router.delete("/:id", deleteOrderHandler);

export default router;
