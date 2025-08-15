import { useParams } from "react-router-dom";
import { useSex, type Sex } from "../contexts/SexContext";
import { useEffect, useState } from "react";
import type { DetailedCategoryResponse } from "../models/DetailedCategoryResponse";
import apiService from "../services/api-service";
import BasicProduct from "../components/BasicProduct";
import ErrorPopup from "../components/ErrorPopup";

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
  }, [sex, categoryId, useEffectTrigger]);

  if (!categoryWithProducts)
    return (
      <div className="loading">
        <p>Laddar...</p>
      </div>
    );

  return (
    <>
      {error && <ErrorPopup error={error} setError={setError} />}
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
                ratingsCount={p.ratingsCount}
                averageGrade={p.averageGrade}
                setUseEffectTrigger={setUseEffectTrigger}
                setError={setError}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryView;
