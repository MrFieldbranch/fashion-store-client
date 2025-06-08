import type { ShoppingBasketItemResponse } from "./ShoppingBasketItemResponse";

export interface ShoppingBasketResponse {
  items: ShoppingBasketItemResponse[];
  totalAmount: number;
  totalQuantity: number;
}
