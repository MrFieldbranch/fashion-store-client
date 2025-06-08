import type { OrderItemResponse } from "./OrderItemResponse";

export interface OrderResponse {
  orderId: number;
  orderDate: Date;
  totalAmount: number;
  items: OrderItemResponse[];
}
