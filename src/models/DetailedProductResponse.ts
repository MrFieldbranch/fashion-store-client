import type { ProductVariantResponse } from "./ProductVariantResponse";

export interface DetailedProductResponse {
  id: number;
  name: string;
  productSex: number;
  imageUrl: string;
  startPrice: number;
  description: string;
  color: string;
  productVariants: ProductVariantResponse[];
  isLiked?: boolean;
}
