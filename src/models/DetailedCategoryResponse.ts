import type { BasicProductResponse } from "./BasicProductResponse";

export interface DetailedCategoryResponse {
  id: number;
  name: string;
  productCount: number;
  productsInCategory: BasicProductResponse[];
}
