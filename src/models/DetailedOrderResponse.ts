import type { OrderItemResponse } from "./OrderItemResponse";

export interface DetailedOrderResponse {
  orderId: number;
  firstName?: string;
  lastName?: string;
  orderDate: Date;
  totalAmount: number;
  items: OrderItemResponse[];
}
