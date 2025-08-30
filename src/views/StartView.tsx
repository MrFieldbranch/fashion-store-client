import { useEffect, useState } from "react";
import type { BasicProductResponse } from "../models/BasicProductResponse";
import apiService from "../services/api-service";
import BasicProduct from "../components/BasicProduct";
import ErrorPopup from "../components/ErrorPopup";

const StartView = () => {
  const [mostPopularMaleProducts, setMostPopularMaleProducts] = useState<BasicProductResponse[]>([]);
  const [mostPopularFemaleProducts, setMostPopularFemaleProducts] = useState<BasicProductResponse[]>([]);
  const [mostPopularUnisexProducts, setMostPopularUnisexProducts] = useState<BasicProductResponse[]>([]);
  const [bestRatedMaleProducts, setBestRatedMaleProducts] = useState<BasicProductResponse[]>([]);
  const [bestRatedFemaleProducts, setBestRatedFemaleProducts] = useState<BasicProductResponse[]>([]);
  const [bestRatedUnisexProducts, setBestRatedUnisexProducts] = useState<BasicProductResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [useEffectTrigger, setUseEffectTrigger] = useState<number>(1);

  useEffect(() => {
    const abortCont = new AbortController();

    setIsLoading(true);

    const fetchProducts = async () => {
      try {
        const [malePurchased, femalePurchased, unisexPurchased, maleRated, femaleRated, unisexRated] =
          await Promise.all([
            apiService.getMostPopularProductsBySexAsync("Male", abortCont.signal),
            apiService.getMostPopularProductsBySexAsync("Female", abortCont.signal),
            apiService.getMostPopularProductsBySexAsync("Unisex", abortCont.signal),
            apiService.getBestRatedProductsBySexAsync("Male", abortCont.signal),
            apiService.getBestRatedProductsBySexAsync("Female", abortCont.signal),
            apiService.getBestRatedProductsBySexAsync("Unisex", abortCont.signal),
          ]);

        if (!abortCont.signal.aborted) {
          setMostPopularMaleProducts(malePurchased);
          setMostPopularFemaleProducts(femalePurchased);
          setMostPopularUnisexProducts(unisexPurchased);
          setBestRatedMaleProducts(maleRated);
          setBestRatedFemaleProducts(femaleRated);
          setBestRatedUnisexProducts(unisexRated);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Ett oväntat fel inträffade.");
        }
      }
    };

    fetchProducts();
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
          <h2>Våra mest sålda produkter</h2>
          <h3>Män</h3>
          <div className="records-container">
            {mostPopularMaleProducts.length === 0 ? (
              <p>Antingen finns det inga produkter för män, eller så har ingen av dessa produkter blivit köpt</p>
            ) : (
              mostPopularMaleProducts.map((p) => (
                <BasicProduct
                  key={`purchased${p.id}`}
                  productId={p.id}
                  productName={p.name}
                  productSex={p.productSex}
                  imageUrl={p.imageUrl}
                  startPrice={p.startPrice}
                  isLiked={p.isLiked ? p.isLiked : false}
                  ratingsCount={p.ratingsCount}
                  averageGrade={p.averageGrade}
                  setUseEffectTrigger={setUseEffectTrigger}
                  setError={setError}
                />
              ))
            )}
          </div>
          <h3>Kvinnor</h3>
          <div className="records-container">
            {mostPopularFemaleProducts.length === 0 ? (
              <p>Antingen finns det inga produkter för kvinnor, eller så har ingen av dessa produkter blivit köpt</p>
            ) : (
              mostPopularFemaleProducts.map((p) => (
                <BasicProduct
                  key={`purchased${p.id}`}
                  productId={p.id}
                  productName={p.name}
                  productSex={p.productSex}
                  imageUrl={p.imageUrl}
                  startPrice={p.startPrice}
                  isLiked={p.isLiked ? p.isLiked : false}
                  ratingsCount={p.ratingsCount}
                  averageGrade={p.averageGrade}
                  setUseEffectTrigger={setUseEffectTrigger}
                  setError={setError}
                />
              ))
            )}
          </div>
          <h3>Unisex</h3>
          <div className="records-container">
            {mostPopularUnisexProducts.length === 0 ? (
              <p>Antingen finns det inga produkter för unisex, eller så har ingen av dessa produkter blivit köpt</p>
            ) : (
              mostPopularUnisexProducts.map((p) => (
                <BasicProduct
                  key={`purchased${p.id}`}
                  productId={p.id}
                  productName={p.name}
                  productSex={p.productSex}
                  imageUrl={p.imageUrl}
                  startPrice={p.startPrice}
                  isLiked={p.isLiked ? p.isLiked : false}
                  ratingsCount={p.ratingsCount}
                  averageGrade={p.averageGrade}
                  setUseEffectTrigger={setUseEffectTrigger}
                  setError={setError}
                />
              ))
            )}
          </div>
          <h2>Produkterna med högst betyg</h2>
          <h3>Män</h3>
          <div className="records-container">
            {bestRatedMaleProducts.length === 0 ? (
              <p>Antingen finns det inga produkter för män, eller så har ingen av dessa produkter blivit betygsatt</p>
            ) : (
              bestRatedMaleProducts.map((p) => (
                <BasicProduct
                  key={`rated${p.id}`}
                  productId={p.id}
                  productName={p.name}
                  productSex={p.productSex}
                  imageUrl={p.imageUrl}
                  startPrice={p.startPrice}
                  isLiked={p.isLiked ? p.isLiked : false}
                  ratingsCount={p.ratingsCount}
                  averageGrade={p.averageGrade}
                  setUseEffectTrigger={setUseEffectTrigger}
                  setError={setError}
                />
              ))
            )}
          </div>
          <h3>Kvinnor</h3>
          <div className="records-container">
            {bestRatedFemaleProducts.length === 0 ? (
              <p>
                Antingen finns det inga produkter för kvinnor, eller så har ingen av dessa produkter blivit betygsatt
              </p>
            ) : (
              bestRatedFemaleProducts.map((p) => (
                <BasicProduct
                  key={`rated${p.id}`}
                  productId={p.id}
                  productName={p.name}
                  productSex={p.productSex}
                  imageUrl={p.imageUrl}
                  startPrice={p.startPrice}
                  isLiked={p.isLiked ? p.isLiked : false}
                  ratingsCount={p.ratingsCount}
                  averageGrade={p.averageGrade}
                  setUseEffectTrigger={setUseEffectTrigger}
                  setError={setError}
                />
              ))
            )}
          </div>
          <h3>Unisex</h3>
          <div className="records-container">
            {bestRatedUnisexProducts.length === 0 ? (
              <p>
                Antingen finns det inga produkter för unisex, eller så har ingen av dessa produkter blivit betygsatt
              </p>
            ) : (
              bestRatedUnisexProducts.map((p) => (
                <BasicProduct
                  key={`rated${p.id}`}
                  productId={p.id}
                  productName={p.name}
                  productSex={p.productSex}
                  imageUrl={p.imageUrl}
                  startPrice={p.startPrice}
                  isLiked={p.isLiked ? p.isLiked : false}
                  ratingsCount={p.ratingsCount}
                  averageGrade={p.averageGrade}
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
