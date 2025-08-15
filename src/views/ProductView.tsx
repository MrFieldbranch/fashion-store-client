import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { DetailedProductResponse } from "../models/DetailedProductResponse";
import apiService from "../services/api-service";
import { useAuth } from "../contexts/AuthContext";
import { useLikedProducts } from "../contexts/LikedProductsContext";
import type { AddItemToShoppingBasketRequest } from "../models/AddItemToShoppingBasketRequest";
import { useShoppingBasket } from "../contexts/ShoppingBasketContext";
import { useToast } from "../contexts/ToastContext";
import ErrorPopup from "../components/ErrorPopup";
import AverageGradeStars from "../components/AverageGradeStars";
import IndividualRatingAndReview from "../components/IndividualRatingAndReview";

type ChosenProduct = {
  size: string;
  productVariantId: number;
};

const ProductView = () => {
  const { productId } = useParams<{ productId: string }>();
  const id = Number(productId);
  const { userRole } = useAuth();
  const { showToast } = useToast();
  const { refreshLikedProductsInNav } = useLikedProducts();
  const { refreshShoppingBasketInNav } = useShoppingBasket();
  const [product, setProduct] = useState<DetailedProductResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSizes, setShowSizes] = useState<boolean>(false);
  const [productChosen, setProductChosen] = useState<ChosenProduct | null>(null);
  const [useEffectTrigger, setUseEffectTrigger] = useState<number>(1);
  const [showRatingsAndReviews, setShowRatingsAndReviews] = useState<boolean>(false);

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchProductWithItsSizes = async () => {
      try {
        const response = await apiService.getProductAsync(id, abortCont.signal);

        if (!abortCont.signal.aborted) {
          setProduct(response);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Ett oväntat fel inträffade.");
        }
      }
    };

    fetchProductWithItsSizes();
    return () => abortCont.abort();
  }, [useEffectTrigger]);

  const handleChooseSize = (productVariantId: number, size: string) => {
    const choice: ChosenProduct = {
      productVariantId: productVariantId,
      size: size,
    };
    setProductChosen(choice);
    setShowSizes(false);
  };

  const handleAddToBasket = async () => {
    if (productChosen) {
      const request: AddItemToShoppingBasketRequest = {
        productVariantId: productChosen.productVariantId,
      };

      try {
        await apiService.addItemToShoppingBasketAsync(request);
        refreshShoppingBasketInNav();
        showToast("Produkt tillagd i varukorg");
      } catch (err: any) {
        setError(err.message || "Ett oväntat fel inträffade. Det gick inte att lägga varan i varukorgen.");
      }
    } else {
      setError("Du måste välja en storlek först, innan du kan lägga en vara i varukorgen.");
    }
  };

  const handleLiking = async (productId: number) => {
    try {
      await apiService.addProductToLikedAsync(productId);
      refreshLikedProductsInNav();
      setUseEffectTrigger((prev) => prev + 1);
    } catch (err: any) {
      setError(err.message || "Ett oväntat fel inträffade. Det gick inte att gilla produkten.");
    }
  };

  const handleUnLiking = async (productId: number) => {
    try {
      await apiService.removeProductFromLikedAsync(productId);
      refreshLikedProductsInNav();
      setUseEffectTrigger((prev) => prev + 1);
    } catch (err: any) {
      setError(err.message || "Ett oväntat fel inträffade. Det gick inte att sluta gilla produkten.");
    }
  };

  const handleLikingWhenNotLoggedIn = () => {
    setError("Du måste vara inloggad för att kunna gilla en produkt.");
  };

  if (!product)
    return (
      <div className="loading">
        <p>Laddar...</p>
      </div>
    );

  const sex = product.productSex === 0 ? "Unisex" : product.productSex === 1 ? "Man" : "Kvinna";
  // Ska jag skapa komponenter här nere?
  return (
    <>
      {error && <ErrorPopup error={error} setError={setError} />}
      <div className="detailed-product">
        <div className="product-large-img-wrapper">
          <img src={product.imageUrl} alt={product.name} className="product-large-img" />
          {userRole && product.isLiked === false && (
            <img
              src="/images/heart-hollow.png"
              alt="hollow heart"
              className="heart-icon"
              onClick={() => handleLiking(product.id)}
            />
          )}
          {userRole && product.isLiked === true && (
            <img
              src="/images/heart-filled.png"
              alt="filled-heart"
              className="heart-icon"
              onClick={() => handleUnLiking(product.id)}
            />
          )}
          {!userRole && (
            <img
              src="/images/heart-hollow.png"
              alt="hollow heart"
              className="heart-icon"
              onClick={handleLikingWhenNotLoggedIn}
            />
          )}
        </div>

        <div className="to-the-right-of-product-large-img">
          <div className="detailed-product-information">
            <h1>{product.name}</h1>
            <p>{sex}</p>
            <p>Färg: {product.color}</p>
            <p>Från {product.startPrice} kr</p>
            {product.description === "" ? (
              <p>Produkten saknar beskrivning</p>
            ) : (
              <p className="description">{product.description}</p>
            )}
          </div>
          <div className="sizes-section">
            {!showSizes && (
              <div className="show-sizes" onClick={() => setShowSizes(true)}>
                {!productChosen && <p className="no-size-chosen">Välj storlek</p>}
                {productChosen && <p className="size-shosen">{productChosen.size}</p>}
              </div>
            )}
            {showSizes && (
              <>
                <div className="clickable-background" onClick={() => setShowSizes(false)} />
                <div className="dropdown-sizes">
                  {product.productVariants.map((v) => {
                    const isOutOfStock = v.stock === 0;

                    return (
                      <div
                        key={v.productVariantId}
                        className={isOutOfStock ? "out-of-stock" : "product-variant"}
                        onClick={isOutOfStock ? undefined : () => handleChooseSize(v.productVariantId, v.size)}
                      >
                        <p>{v.size}</p>
                        {isOutOfStock && <p>Slutsåld</p>}
                        {v.stock <= 5 && v.stock > 1 && <p className="low-stock">Endast ett fåtal kvar!</p>}
                        {v.stock === 1 && <p className="low-stock">Endast 1 ex kvar!</p>}
                        <p>{v.price} kr</p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            {productChosen && (
              <button className="add-to-shopping-basket" onClick={handleAddToBasket}>
                Lägg i varukorgen
              </button>
            )}
          </div>
          <div className="detailed-product-ratings-and-reviews">
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
              <button className="show-ratings-and-reviews-button" onClick={() => setShowRatingsAndReviews(true)}>
                Visa alla betyg och recensioner
              </button>
            )}
            {showRatingsAndReviews && (
              <div className="clickable-background-ratings" onClick={() => setShowRatingsAndReviews(false)}>
                <div className="display-all-ratings-and-reviews">
                  <div className="fixed-heading-ratings-and-reviews">
                    <button
                      className="remove-item-from-shopping-basket"
                      onClick={() => setShowRatingsAndReviews(false)}
                    >
                      X
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
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductView;
