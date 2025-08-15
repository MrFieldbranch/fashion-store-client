import type { ProductVariantResponse } from "./ProductVariantResponse";
import type { RatingAndReviewResponse } from "./RatingAndReviewResponse";

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
  ratingsCount: number;
  averageGrade: number;
  ratingsAndReviews: RatingAndReviewResponse[];
}
