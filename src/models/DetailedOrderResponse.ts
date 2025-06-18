import type { OrderItemResponse } from "./OrderItemResponse";

export interface DetailedOrderResponse {
  orderId: number;
  orderDate: Date;
  totalAmount: number;
  items: OrderItemResponse[];
}
