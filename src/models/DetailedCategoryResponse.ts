import type { ProductResponse } from "./ProductResponse";

export interface DetailedCategoryResponse {
  id: number;
  name: string;
  productCount: number;
  productsInCategory: ProductResponse[];
}
