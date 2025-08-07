import { useState } from "react";
import ErrorPopup from "../components/ErrorPopup";

const RatingsAndReviewsView = () => {
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      {error && <ErrorPopup error={error} setError={setError} />}
      <div className="ratings-and-reviews">
        <h1>Berätta vad du tycker</h1>
      </div>
    </>
  );
};

export default RatingsAndReviewsView;
