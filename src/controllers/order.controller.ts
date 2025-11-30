// src/controllers/order.controller.ts
import { Context } from "koa";
import { validateCreatePayload } from "../validators/order.validator";
import {
  createOrder,
  getOrderById,
  listOrders,
  updateOrderById,
  deleteOrderById,
} from "../services/order.service";

/**
 * Handler para criar um pedido.
 * Faz validação do payload e chama o service que aplica o mapeamento e salva no banco.
 */
export async function createOrderHandler(ctx: Context) {
  const body = ctx.request.body;
  const validation = validateCreatePayload(body);
  if (!validation.valid) {
    ctx.status = 400;
    ctx.body = { success: false, error: validation.message };
    return;
  }

  try {
    const saved = await createOrder(body);
    ctx.status = 201;
    ctx.body = { success: true, data: saved };
  } catch (err: any) {
    // Trata duplicidade (orderId único)
    if (err.code === 11000) {
      ctx.status = 409;
      ctx.body = { success: false, error: "Pedido já existe" };
      return;
    }
    ctx.status = 500;
    ctx.body = { success: false, error: err.message || "Erro ao criar pedido" };
  }
}

/**
 * Handler para obter um pedido por orderId (via URL param)
 */
export async function getOrderHandler(ctx: Context) {
  const orderId = ctx.params.id;
  if (!orderId) {
    ctx.status = 400;
    ctx.body = { success: false, error: "orderId na URL é obrigatório" };
    return;
  }
  try {
    const order = await getOrderById(orderId);
    if (!order) {
      ctx.status = 404;
      ctx.body = { success: false, error: "Pedido não encontrado" };
      return;
    }
    ctx.status = 200;
    ctx.body = { success: true, data: order };
  } catch (err: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: err.message || "Erro ao buscar pedido",
    };
  }
}

/**
 * Handler para listar todos os pedidos.
 */
export async function listOrdersHandler(ctx: Context) {
  try {
    const orders = await listOrders();
    ctx.status = 200;
    ctx.body = { success: true, data: orders };
  } catch (err: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: err.message || "Erro ao listar pedidos",
    };
  }
}

/**
 * Handler para atualizar um pedido por orderId.
 * Valida o payload (mesma validação de criação) e atualiza value, creationDate e items.
 */
export async function updateOrderHandler(ctx: Context) {
  const orderId = ctx.params.id;
  const body = ctx.request.body;

  if (!orderId) {
    ctx.status = 400;
    ctx.body = { success: false, error: "orderId na URL é obrigatório" };
    return;
  }

  const validation = validateCreatePayload(body);
  if (!validation.valid) {
    ctx.status = 400;
    ctx.body = { success: false, error: validation.message };
    return;
  }

  try {
    const updated = await updateOrderById(orderId, body);
    if (!updated) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        error: "Pedido não encontrado para atualizar",
      };
      return;
    }
    ctx.status = 200;
    ctx.body = { success: true, data: updated };
  } catch (err: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: err.message || "Erro ao atualizar pedido",
    };
  }
}

/**
 * Handler para deletar um pedido por orderId.
 * Retorna o documento deletado em caso de sucesso.
 */
export async function deleteOrderHandler(ctx: Context) {
  const orderId = ctx.params.id;
  if (!orderId) {
    ctx.status = 400;
    ctx.body = { success: false, error: "orderId na URL é obrigatório" };
    return;
  }

  try {
    const deleted = await deleteOrderById(orderId);
    if (!deleted) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        error: "Pedido não encontrado para deletar",
      };
      return;
    }
    ctx.status = 200;
    ctx.body = { success: true, data: deleted };
  } catch (err: any) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: err.message || "Erro ao deletar pedido",
    };
  }
}
