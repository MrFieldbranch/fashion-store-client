type IndividualRatingAndReviewProps = {
  grade: number;
  reviewText: string | null;
  firstName: string;
  lastName: string;
};

// Tillfällig lösning här nere, med att använda <p>.
const IndividualRatingAndReview = ({ grade, reviewText, firstName, lastName }: IndividualRatingAndReviewProps) => {
  const getCorrectStarImage = (fillPercent: number) => {    
    /* const rounded = Math.min(100, Math.max(0, Math.round(fillPercent))); */
    return `/images/star-${fillPercent}.png`;
  };

  const stars = [];
  let remaining = Math.round(grade);

  for (let i = 0; i < 5; i++) {
    let fill = 0;
    if (remaining >= 1) {
      fill = 100;
    }

    stars.push(<img key={i} src={getCorrectStarImage(fill)} alt="Stjärna" className="star-image-big" />);
    remaining -= 1;
  }

  return (
    <div className="individual-rating-and-review">
      <div className="individual-rating-and-review-content">
        <div className="stars">{stars}</div>
        {reviewText ? <p>"{reviewText}"</p> : <p className="italic">Ingen recension</p>}
        <p>- {firstName} {lastName}</p>
      </div>
    </div>
  );
};

export default IndividualRatingAndReview;
