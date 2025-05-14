import type { ProductVariantResponse } from "./ProductVariantResponse";

export interface ProductResponse {
  id: number;
  name: string;
  productSex: number;
  imageUrl: string;
  startPrice?: number;
  description?: string;
  color?: string;
  productVariants?: ProductVariantResponse[];
}
