import type { BasicOrderResponse } from "./BasicOrderResponse";

export interface OrderListForUserResponse {
  userId: number;
  firstName: string;
  lastName: string;
  orders: BasicOrderResponse[];
}
