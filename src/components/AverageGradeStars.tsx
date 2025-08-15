type AverageGradeStarsProps = {
  average: number;
  ratingsCount: number;
  variant: "basic-product" | "detailed-product";
};

const AverageGradeStars = ({ average, ratingsCount, variant }: AverageGradeStarsProps) => {
  if (ratingsCount === 0) {
    return variant === "detailed-product" ? (
      <div>
        <p>Denna produkt har inga betyg än</p>
      </div>
    ) : null;
  }

  const getCorrectStarImage = (fillPercent: number) => {
    const rounded = Math.round(fillPercent);
    /* const rounded = Math.min(100, Math.max(0, Math.round(fillPercent))); */
    return `/images/star-${rounded}.png`;
  };

  const stars = [];
  let remaining = average;

  for (let i = 0; i < 5; i++) {
    let fill = 0;

    if (remaining >= 1) {
      fill = 100;
    } else if (remaining > 0) {
      fill = remaining * 100;
    }

    stars.push(
      <img
        key={i}
        src={getCorrectStarImage(fill)}
        alt="Stjärna"
        className={variant === "basic-product" ? "star-image-small" : "star-image-big"}
      />
    );
    remaining -= 1;
  }

  return (
    <div className="stars-and-ratings-count">
      <div className="stars">{stars}</div>
      {variant === "basic-product" && <span className="ratings-count">({ratingsCount})</span>}
    </div>
  );
};

export default AverageGradeStars;
