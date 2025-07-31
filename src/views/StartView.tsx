import { useEffect, useState } from "react";
import type { BasicProductResponse } from "../models/BasicProductResponse";
import apiService from "../services/api-service";
import BasicProduct from "../components/BasicProduct";
import ErrorPopup from "../components/ErrorPopup";

const StartView = () => {
  const [mostPopularMaleProducts, setMostPopularMaleProducts] = useState<BasicProductResponse[]>([]);
  const [mostPopularFemaleProducts, setMostPopularFemaleProducts] = useState<BasicProductResponse[]>([]);
  const [mostPopularUnisexProducts, setMostPopularUnisexProducts] = useState<BasicProductResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [useEffectTrigger, setUseEffectTrigger] = useState<number>(1);

  useEffect(() => {
    const abortCont = new AbortController();

    setIsLoading(true);

    const fetchPopularProducts = async () => {
      try {
        const [male, female, unisex] = await Promise.all([
          apiService.getMostPopularProductsBySexAsync("Male", abortCont.signal),
          apiService.getMostPopularProductsBySexAsync("Female", abortCont.signal),
          apiService.getMostPopularProductsBySexAsync("Unisex", abortCont.signal),
        ]);

        if (!abortCont.signal.aborted) {
          setMostPopularMaleProducts(male);
          setMostPopularFemaleProducts(female);
          setMostPopularUnisexProducts(unisex);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Ett oväntat fel inträffade.");
        }
      }
    };

    fetchPopularProducts();
    setIsLoading(false);
    return () => abortCont.abort();
  }, [useEffectTrigger]);

  if (isLoading)
    return (
      <div className="loading">
        <p>Laddar...</p>
      </div>
    );

  return (
    <>
      {error && <ErrorPopup error={error} setError={setError} />}
      <div className="start">
        <div className="hero-section-wide-screen">
          <div className="hero-image-1" />
          <div className="hero-text">
            <h2>
              Tidlös stil möter
              <br />
              djärvt självförtroende
            </h2>
          </div>
          <div className="hero-text">
            <h2>
              Berätta vem du är
              <br />
              genom vad du har på dig
            </h2>
          </div>
          <div className="hero-image-2" />
        </div>
        <div className="hero-section-narrow-screen">
          <div className="hero-image-1" />
          <div className="hero-text">
            <h2>
              Tidlös stil möter
              <br />
              djärvt självförtroende
            </h2>
          </div>
          <div className="hero-image-2" />
          <div className="hero-text">
            <h2>
              Berätta vem du är
              <br />
              genom vad du har på dig
            </h2>
          </div>
        </div>
        <div className="popular-products">
          <h2>Populära produkter just nu</h2>
          <h3>Män</h3>
          <div className="records-container">
            {mostPopularMaleProducts.length === 0 ? (
              <p>Antingen finns det inga produkter för män, eller så har ingen produkt blivit köpt</p>
            ) : (
              mostPopularMaleProducts.map((p) => (
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
          <h3>Kvinnor</h3>
          <div className="records-container">
            {mostPopularFemaleProducts.length === 0 ? (
              <p>Antingen finns det inga produkter för kvinnor, eller så har ingen produkt blivit köpt</p>
            ) : (
              mostPopularFemaleProducts.map((p) => (
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
          <h3>Unisex</h3>
          <div className="records-container">
            {mostPopularUnisexProducts.length === 0 ? (
              <p>Antingen finns det inga produkter för unisex, eller så har ingen produkt blivit köpt</p>
            ) : (
              mostPopularUnisexProducts.map((p) => (
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
      </div>
    </>
  );
};

export default StartView;
