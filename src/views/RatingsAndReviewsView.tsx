import { useState } from "react";
import ErrorPopup from "../components/ErrorPopup";
/* import type { RatingReminderResponse } from "../models/RatingReminderResponse";
import apiService from "../services/api-service"; */
import ProductRatingReview from "../components/ProductRatingReview";
import { useRatingReminder } from "../contexts/RatingReminderContext";

const RatingsAndReviewsView = () => {
  const { ratingReminders, refreshRatingReminders } = useRatingReminder();
  /* const [productsToBeRated, setProductsToBeRated] = useState<RatingReminderResponse[]>([]); */
  const [error, setError] = useState<string | null>(null);
  /* const [isLoading, setIsLoading] = useState<boolean>(true);
  const [useEffectTrigger, setUseEffectTrigger] = useState<number>(1); */

  /* useEffect(() => {
    const abortCont = new AbortController();

    const fetchProductsToBeRated = async () => {
      try {
        const response = await apiService.getRatingRemindersAsync(abortCont.signal);
        if (!abortCont.signal.aborted) {
          setProductsToBeRated(response);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Ett oväntat fel inträffade.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductsToBeRated();
    return () => abortCont.abort();
  }, [useEffectTrigger]);

  if (isLoading)
    return (
      <div className="loading">
        <p>Laddar...</p>
      </div>
    ); */

  return (
    <>
      {error && <ErrorPopup error={error} setError={setError} />}
      <div className="ratings-and-reviews">
        <h1>Berätta vad du tycker</h1>
        {ratingReminders.length === 0 ? (
          <p>Du har inga produkter att betygsätta</p>
        ) : (
          ratingReminders.map((p) => (
            <ProductRatingReview
              key={p.productId}
              productId={p.productId}
              productName={p.productName}
              productImageUrl={p.productImageUrl}
              setUseEffectTrigger={refreshRatingReminders}
              setError={setError}
            />
          ))
        )}
      </div>
    </>
  );
};

export default RatingsAndReviewsView;
