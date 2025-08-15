export interface RatingAndReviewResponse {
  ratingId: number;
  productId: number;
  grade: number;
  reviewId: number | null;
  reviewText: string | null;
  userFirstName: string;
  userLastName: string;
}
