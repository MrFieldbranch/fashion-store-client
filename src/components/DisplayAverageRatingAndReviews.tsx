import type { DetailedProductResponse } from "../models/DetailedProductResponse";
import AverageGradeStars from "./AverageGradeStars";
import IndividualRatingAndReview from "./IndividualRatingAndReview";

type DisplayAverageRatingAndReviewsProps = {
  product: DetailedProductResponse;
  showRatingsAndReviews: boolean;
  setShowRatingsAndReviews: React.Dispatch<React.SetStateAction<boolean>>;
};

const DisplayAverageRatingAndReviews = ({
  product,
  showRatingsAndReviews,
  setShowRatingsAndReviews,
}: DisplayAverageRatingAndReviewsProps) => {
  return (
    <>
      <div className="average-grade-and-ratings-count">
        <div className="grade-and-stars">
          {product.ratingsCount > 0 && <p className="big-p">{product.averageGrade}</p>}
          <AverageGradeStars
            ratingsCount={product.ratingsCount}
            average={product.averageGrade}
            variant="detailed-product"
          />
        </div>
        {product.ratingsCount > 0 && <p className="big-p">{product.ratingsCount} betyg</p>}
      </div>
      {!showRatingsAndReviews && product.ratingsCount > 0 && (
        <button className="button-purple" onClick={() => setShowRatingsAndReviews(true)}>
          Visa alla betyg och recensioner
        </button>
      )}
      {showRatingsAndReviews && (
        <div className="clickable-background-ratings" onClick={() => setShowRatingsAndReviews(false)}>
          <div className="display-all-ratings-and-reviews">
            <div className="fixed-heading-ratings-and-reviews">
              <button className="button-white" onClick={() => setShowRatingsAndReviews(false)}>
                Stäng
              </button>
            </div>
            <div className="scroll-list">
              <h2 className="pad-left">Alla betyg och recensioner</h2>
              {product.ratingsAndReviews.map((r) => (
                <IndividualRatingAndReview
                  grade={r.grade}
                  reviewText={r.reviewText}
                  firstName={r.userFirstName}
                  lastName={r.userLastName}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DisplayAverageRatingAndReviews;
