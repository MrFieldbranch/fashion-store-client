import React, { useState } from "react";
import type { CreateRatingRequest } from "../models/CreateRatingRequest";
import apiService from "../services/api-service";
import type { CreateReviewRequest } from "../models/CreateReviewRequest";
import { useToast } from "../contexts/ToastContext";
/* import { useRatingReminder } from "../contexts/RatingReminderContext"; */

type ProductRatingReviewProps = {
  productId: number;
  productName: string;
  productImageUrl: string;
  setUseEffectTrigger: React.Dispatch<React.SetStateAction<number>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

const ProductRatingReview = ({
  productId,
  productName,
  productImageUrl,
  setUseEffectTrigger,
  setError,
}: ProductRatingReviewProps) => {
  /* const { refreshRatingReminderNumber } = useRatingReminder(); */
  const { showToast } = useToast();
  const [grade, setGrade] = useState<number>(3);
  const [ratingHasBeenSent, setRatingHasBeenSent] = useState<boolean>(false);
  const [review, setReview] = useState<string>("");

  const handleChangeGrade = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGrade(Number(e.target.value));
  };

  const handleSendRating = async () => {
    const request: CreateRatingRequest = {
      grade: grade,
    };
    try {
      await apiService.createRatingAsync(productId, request);
      await apiService.markReminderAsAnsweredAsync(productId);
      /* refreshRatingReminderNumber(); */
      setRatingHasBeenSent(true);
    } catch (err: any) {
      setError(err.message || "Ett fel inträffade. Det gick inte att betygsätta produkten.");
    }
  };

  const handleDeclineRatingThisProduct = async () => {
    try {
      await apiService.markReminderAsAnsweredAsync(productId);
      /* refreshRatingReminders(); */
      setUseEffectTrigger((prev) => prev + 1);
    } catch (err: any) {
      setError(err.message || "Ett fel inträffade. Det gick inte att markera påminnelsen som besvarad.");
    }
  };

  const handleSendReview = async () => {
    if (review.trim() === "") {
      setError("Recensionen skickades inte. Du måste skriva något.");
      return;
    }
    const request: CreateReviewRequest = {
      text: review,
    };
    try {
      await apiService.createReviewAsync(productId, request);
      setUseEffectTrigger((prev) => prev + 1);
      showToast(`Tack för att du betygsatte och recenserade ${productName}!`);
    } catch (err: any) {
      setError(err.message || "Ett fel inträffade. Det gick inte att recensera produkten.");
    }
  };

  const handleDeclineReviewingThisProduct = () => {
    setUseEffectTrigger((prev) => prev + 1);
    showToast(`Tack för att du betygsatte ${productName}!`);
  }

  return (
    <div className="product-rating-review">
      <div className="vertical-gap">
        <div className="product-and-image">
          <h3>{productName}</h3>
          <img src={productImageUrl} alt={productName} className="product-tiny-img" />
        </div>
        {ratingHasBeenSent === false && (
          <>
            <div className="rating">
              <label className="radio-label">
                <input
                  type="radio"
                  name={`rating-${productId}`}
                  value="1"
                  checked={grade === 1}
                  onChange={handleChangeGrade}
                />
                1
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name={`rating-${productId}`}
                  value="2"
                  checked={grade === 2}
                  onChange={handleChangeGrade}
                />
                2
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name={`rating-${productId}`}
                  value="3"
                  checked={grade === 3}
                  onChange={handleChangeGrade}
                />
                3
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name={`rating-${productId}`}
                  value="4"
                  checked={grade === 4}
                  onChange={handleChangeGrade}
                />
                4
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name={`rating-${productId}`}
                  value="5"
                  checked={grade === 5}
                  onChange={handleChangeGrade}
                />
                5
              </label>
            </div>
            <div className="confirm-or-cancel">
              <button className="button-green" onClick={handleSendRating}>
                Skicka betyg
              </button>
              <button className="button-red" onClick={handleDeclineRatingThisProduct}>
                Nej tack
              </button>
            </div>
          </>
        )}
      </div>
      {ratingHasBeenSent && (
        <div className="vertical-gap">
          <div className="label-and-input">
            <label htmlFor={`review-${productId}`}>Tack för betyget! Skriv gärna en recension också.</label>
            <textarea
              className="review-textarea"
              id={`review-${productId}`}
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>
          <div className="confirm-or-cancel">
            <button className="button-green" onClick={handleSendReview}>
              Skicka recension
            </button>
            <button className="button-red" onClick={handleDeclineReviewingThisProduct}>
              Nej tack
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductRatingReview;
