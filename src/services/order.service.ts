import { OrderModel } from "../models/order.model";

/**
 * Faz o mapeamento do payload recebido (campos em PT-BR) para o formato interno do banco.
 * Entrada esperada: numeroPedido, valorTotal, dataCriacao, items[] (idItem, quantidadeItem, valorItem)
 * Saída: orderId, value, creationDate (Date), items[] (productId, quantity, price)
 */
export function mapIncomingToOrder(body: any) {
  const orderId = String(body.numeroPedido);
  const value = Number(body.valorTotal);
  const creationDate = new Date(body.dataCriacao);
  const items = (body.items || []).map((it: any) => ({
    productId: Number(it.idItem),
    quantity: Number(it.quantidadeItem),
    price: Number(it.valorItem),
  }));
  return { orderId, value, creationDate, items };
}

/**
 * Cria um pedido no MongoDB. O mapeamento é feito antes de salvar.
 */
export async function createOrder(payload: any) {
  const mapped = mapIncomingToOrder(payload);
  const doc = new OrderModel({
    orderId: mapped.orderId,
    value: mapped.value,
    creationDate: mapped.creationDate,
    items: mapped.items,
  });
  return doc.save();
}

/**
 * Busca um pedido por orderId (string única)
 */
export async function getOrderById(orderId: string) {
  return OrderModel.findOne({ orderId }).lean();
}

/**
 * Lista todos pedidos (paginação pode ser adicionada depois)
 */
export async function listOrders() {
  return OrderModel.find().sort({ creationDate: -1 }).lean();
}

/**
 * Atualiza um pedido pelo orderId.
 * Faz o mapeamento do payload e substitui value, creationDate e items.
 */
export async function updateOrderById(orderId: string, payload: any) {
  const mapped = mapIncomingToOrder(payload);
  return OrderModel.findOneAndUpdate(
    { orderId },
    {
      $set: {
        value: mapped.value,
        creationDate: mapped.creationDate,
        items: mapped.items,
      },
    },
    { new: true, upsert: false }
  ).lean();
}

/**
 * Deleta um pedido pelo orderId e retorna o documento deletado.
 */
export async function deleteOrderById(orderId: string) {
  return OrderModel.findOneAndDelete({ orderId }).lean();
}
