import mongoose, { Schema, Document } from "mongoose";

// Interface Typescript representando um item do pedido
export interface IOrderItem {
  productId: number;
  quantity: number;
  price: number;
}

// Interface do pedido
export interface IOrder extends Document {
  orderId: string;
  value: number;
  creationDate: Date;
  items: IOrderItem[];
}

// Schema do item (subdocumento)
const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Number, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

// Schema principal do pedido
const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    value: { type: Number, required: true },
    creationDate: { type: Date, required: true },
    items: { type: [OrderItemSchema], required: true },
  },
  {
    timestamps: true,
    collection: "orders",
  }
);

// Exporta o model (reusa caso já exista para evitar recompilação dupla em dev)
export const OrderModel =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
