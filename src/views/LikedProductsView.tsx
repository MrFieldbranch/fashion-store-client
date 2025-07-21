import { useEffect, useState } from "react";
import type { BasicProductResponse } from "../models/BasicProductResponse";
import apiService from "../services/api-service";
import BasicProduct from "../components/BasicProduct";

const LikedProductsView = () => {
  const [listOfProducts, setListOfProducts] = useState<BasicProductResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [useEffectTrigger, setUseEffectTrigger] = useState<number>(1);

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchProducts = async () => {
      try {
        const response = await apiService.getLikedProductsAsync(abortCont.signal);
        setIsLoading(false);
        if (!abortCont.signal.aborted) {
          setListOfProducts(response);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Ett oväntat fel inträffade.");
        }
      }
    };

    fetchProducts();
    return () => abortCont.abort();
  }, [useEffectTrigger]);

  if (isLoading)
    return (
      <div className="loading">
        <p>Laddar...</p>
      </div>
    );

  if (error)
    return (
      <div className="non-clickable-background" onClick={(e) => e.stopPropagation()}>
        <div className="pop-up">
          <p>{error}</p>
          <button className="go-back" onClick={() => setError(null)}>
            Tillbaka
          </button>
        </div>
      </div>
    );

  return (
    <div className="liked-products">
      <h1>Gillade produkter</h1>
      <div className="records-container">
        {listOfProducts.length === 0 ? (
          <p>Du har inga gillade produkter</p>
        ) : (
          listOfProducts.map((p) => (
            <BasicProduct
              key={p.id}
              productId={p.id}
              productName={p.name}
              productSex={p.productSex}
              imageUrl={p.imageUrl}
              startPrice={p.startPrice}
              isLiked={p.isLiked ? p.isLiked : false}
              setUseEffectTrigger={setUseEffectTrigger}
              setError={setError}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default LikedProductsView;
