import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { DetailedCategoryResponse } from "../../models/DetailedCategoryResponse";
import apiService from "../../services/api-service";
import AdminBasicProduct from "../../components/admin-components/AdminBasicProduct";
import Nav from "../../components/Nav";
import type { CreateNewProductRequest } from "../../models/CreateNewProductRequest";

const CategoryAdminView = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const id = Number(categoryId);

  const [categoryWithProducts, setCategoryWithProducts] = useState<DetailedCategoryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEnterNewProduct, setShowEnterNewProduct] = useState<boolean>(false);
  const [productName, setProductName] = useState<string>("");
  const [productSex, setProductSex] = useState<number>(0);
  const [productImageUrl, setProductImageUrl] = useState<string>("");
  const [productColor, setProductColor] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [useEffectTrigger, setUseEffectTrigger] = useState<number>(1);

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
  }, [useEffectTrigger]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductSex(Number(e.target.value));
  };

  const handleCloseEnterNewProduct = () => {
    setProductName("");
    setProductSex(0);
    setProductImageUrl("");
    setProductColor("");
    setProductDescription("");
    setShowEnterNewProduct(false);
  };

  const handleCreateNewProduct = async (
    productName: string,
    productSex: number,
    productImageUrl: string,
    productColor: string,
    productDescription: string
  ) => {
    if (productName.trim() === "" || productImageUrl.trim() === "" || productColor.trim() === "") {
      handleCloseEnterNewProduct();
      setError(
        "Skapande av ny produkt misslyckades. Du måste skriva något i alla fält (förutom Beskrivning, som är valfri)."
      );
      return;
    }

    const newProductRequest: CreateNewProductRequest = {
      name: productName,
      productSex: productSex,
      imageUrl: productImageUrl,
      color: productColor,
      description: productDescription,
    };

    try {
      await apiService.createNewProductAsync(id, newProductRequest);
      setUseEffectTrigger((prev) => prev + 1);
    } catch (err: any) {
      setError(err.message || "Ett oväntat fel inträffade. Den nya produkten skapades inte.");
    } finally {
      handleCloseEnterNewProduct();
    }
  };

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
    <div className="main-container">
      <Nav />
      <div className="category-with-products">
        <h1>{categoryWithProducts.name}</h1>
        <p>Antal produkter: {categoryWithProducts.productCount}</p>
        <div className="records-container">
          {categoryWithProducts.productCount === 0 ? (
            <div className="no-records">
              <p>Inga produkter finns i kategorin</p>
            </div>
          ) : (
            categoryWithProducts.productsInCategory.map((p) => (
              <AdminBasicProduct
                key={p.id}
                productId={p.id}
                productName={p.name}
                productSex={p.productSex}
                imageUrl={p.imageUrl}
                startPrice={p.startPrice ? p.startPrice : 0}
              />
            ))
          )}
        </div>
        {!showEnterNewProduct && (
          <button className="press-to-create-edit" onClick={() => setShowEnterNewProduct(true)}>
            Skapa ny produkt
          </button>
        )}
        {showEnterNewProduct && (
          <div className="create-edit">
            <h3>Skapa ny produkt</h3>
            <div className="label-and-input">
              <label htmlFor="productname">Nytt produktnamn</label>
              <input
                type="text"
                id="productname"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <label className="radio-label">
              <input type="radio" name="option" value="0" checked={productSex === 0} onChange={handleChange} />
              Unisex
            </label>
            <label className="radio-label">
              <input type="radio" name="option" value="1" checked={productSex === 1} onChange={handleChange} />
              Man
            </label>
            <label className="radio-label">
              <input type="radio" name="option" value="2" checked={productSex === 2} onChange={handleChange} />
              Kvinna
            </label>

            <div className="label-and-input">
              <label htmlFor="productimageurl">URL för produktens bild</label>
              <input
                type="text"
                id="productimageurl"
                required
                value={productImageUrl}
                onChange={(e) => setProductImageUrl(e.target.value)}
              />
            </div>

            <div className="label-and-input">
              <label htmlFor="color">Produktfärg</label>
              <input
                type="text"
                id="color"
                required
                value={productColor}
                onChange={(e) => setProductColor(e.target.value)}
              />
            </div>

            <div className="label-and-input">
              <label htmlFor="productdescription">Valfri beskrivning av produkten</label>
              <textarea
                id="productdescription"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </div>

            <div className="confirm-or-cancel">
              <button
                className="confirm-button"
                onClick={() =>
                  handleCreateNewProduct(productName, productSex, productImageUrl, productColor, productDescription)
                }
              >
                OK
              </button>
              <button className="cancel-button" onClick={handleCloseEnterNewProduct}>
                AVBRYT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryAdminView;
