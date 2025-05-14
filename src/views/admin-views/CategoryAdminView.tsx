import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { DetailedCategoryResponse } from "../../models/DetailedCategoryResponse";
import apiService from "../../services/api-service";
import AdminBasicProduct from "../../components/admin-components/AdminBasicProduct";

const CategoryAdminView = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const id = Number(categoryId);

  const [categoryWithProducts, setCategoryWithProducts] = useState<DetailedCategoryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchCategoryWithProducts = async () => {
      try {
        const response = await apiService.getProductsByCategoryAsync(id, abortCont.signal);

        if (!abortCont.signal.aborted) {
          setCategoryWithProducts(response);
          /* setError(null); */
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Ett oväntat fel inträffade.");
        }
      }
    };

    fetchCategoryWithProducts();
    return () => abortCont.abort();
  }, []);

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
    <div className="category-with-products">
      <h1>{categoryWithProducts.name}</h1>
      <p>Antal produkter: {categoryWithProducts.productCount}</p>
      {categoryWithProducts.productsInCategory.map((p) => (
        <AdminBasicProduct
          key={p.id}
          productId={p.id}
          productName={p.name}
          productSex={p.productSex}
          imageUrl={p.imageUrl}
          startPrice={p.startPrice ? p.startPrice : 0}
        />
      ))}
    </div>
  );
};

export default CategoryAdminView;
