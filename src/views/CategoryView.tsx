import { useParams } from "react-router-dom";
import Nav from "../components/Nav";
import { useSex, type Sex } from "../contexts/SexContext";
import { useEffect, useState } from "react";
import type { DetailedCategoryResponse } from "../models/DetailedCategoryResponse";
import apiService from "../services/api-service";
import BasicProduct from "../components/BasicProduct";
import Footer from "../components/Footer";

const CategoryView = () => {
  const { categoryId, sex } = useParams<{ categoryId: string; sex: Sex }>();
  const id = Number(categoryId);
  const { setSex } = useSex();
  const [categoryWithProducts, setCategoryWithProducts] = useState<DetailedCategoryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useEffectTrigger, setUseEffectTrigger] = useState<number>(1);

  useEffect(() => {
    if (!sex) {
      setError("Inget kön är valt.");
      return;
    }
    setSex(sex);

    const abortCont = new AbortController();

    const fetchCategoryWithProductsBasedOnSex = async () => {
      try {
        const response = await apiService.getProductsByCategoryBasedOnSexAsync(id, sex, abortCont.signal);
        if (!abortCont.signal.aborted) {
          setCategoryWithProducts(response);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Ett oväntat fel inträffade.");
        }
      }
    };

    fetchCategoryWithProductsBasedOnSex();

    return () => abortCont.abort();
  }, [sex, useEffectTrigger]);

  if (!categoryWithProducts)
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
          <button onClick={() => setError(null)}>Tillbaka</button>
        </div>
      </div>
    );

  return (
    <>
      <Nav />
      <div className="main-container">
        <div className="category">
          <h1>{categoryWithProducts.name}</h1>
          <div className="records-container">
            {categoryWithProducts.productCount === 0 ? (
              <p>Inga produkter finns för detta val</p>
            ) : (
              categoryWithProducts.productsInCategory.map((p) => (
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
      <Footer />
    </>
  );
};

export default CategoryView;
