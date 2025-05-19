import { useParams } from "react-router-dom";
import Nav from "../../components/Nav";
import type { DetailedProductResponse } from "../../models/DetailedProductResponse";
import { useEffect, useState } from "react";
import AdminProductVariant from "../../components/admin-components/AdminProductVariant";
import apiService from "../../services/api-service";
import type { CreateNewProductVariantRequest } from "../../models/CreateNewProductVariantRequest";
import type { UpdateExistingProductRequest } from "../../models/UpdateExistingProductRequest";

const ProductAdminView = () => {
  const { productId } = useParams<{ productId: string }>();
  const id = Number(productId);

  const [product, setProduct] = useState<DetailedProductResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEditProduct, setShowEditProduct] = useState<boolean>(false);
  const [newProductName, setNewProductName] = useState<string>("");
  const [newProductSex, setNewProductSex] = useState<number>(0);
  const [newProductDescription, setNewProductDescription] = useState("");
  const [newImageUrl, setNewImageUrl] = useState<string>("");
  const [newProductColor, setNewProductColor] = useState<string>("");
  const [showEnterNewProductVariant, setShowEnterNewProductVariant] = useState<boolean>(false);
  const [productVariantSize, setProductVariantSize] = useState<string>("");
  const [productVariantSKU, setProductVariantSKU] = useState<string>("");
  const [productVariantPriceAsString, setProductVariantPriceAsString] = useState<string>("");
  const [productVariantStockAsString, setProductVariantStockAsString] = useState<string>("");
  const [useEffectTrigger, setUseEffectTrigger] = useState<number>(1);

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

  const handleShowEditProduct = () => {
    setShowEditProduct(true);
    if (product) {
      setNewProductName(product.name);
      setNewProductSex(product.productSex);
      setNewImageUrl(product.imageUrl);
      setNewProductColor(product.color);
      setNewProductDescription(product.description ?? "");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProductSex(Number(e.target.value));
  };

  const handleCloseEditProduct = () => {
    setNewProductName("");
    setNewProductSex(0);
    setNewImageUrl("");
    setNewProductColor("");
    setNewProductDescription("");
    setShowEditProduct(false);
  };

  // Ska jag ha med trim(), så som jag har i komponenten AdminProductView? I så fall kanske jag borde ha det överallt.
  // Jag skickar med alla värden, även fast de inte har ändrats. Det sker en kontroll i backend om de har ändrats. Det är mer
  // semantiskt korrekt, eftersom jag använder PUT.
  const handleEditProduct = async (
    newProductName: string,
    newProductSex: number,
    newProductDescription: string,
    newImageUrl: string,
    newProductColor: string
  ) => {
    const isValuesMissing = newProductName === "" || newImageUrl === "" || newProductColor === "";

    if (isValuesMissing) {
      handleCloseEditProduct();
      setError("Förfrågan skickades inte, eftersom fälten 'Namn', 'URL' och 'Färg' är obligatoriska.");
      return;
    }

    if (product) {
      const isUnchanged =
        newProductName === product.name &&
        newProductSex === product.productSex &&
        newImageUrl === product.imageUrl &&
        newProductColor === product.color &&
        newProductDescription === product.description;

      if (isUnchanged) {
        handleCloseEditProduct();
        setError("Förfrågan skickades inte, eftersom du inte har gjort några ändringar.");
      }

      const request: UpdateExistingProductRequest = {
        name: newProductName,
        productSex: newProductSex,
        imageUrl: newImageUrl,
        color: newProductColor,
        description: newProductDescription
      };

      try {
        await apiService.updateExistingProductAsync(id, request);
        setUseEffectTrigger((prev) => prev + 1);
      } catch (err: any) {
        setError(err.message || "Ett oväntat fel inträffade. Det gick inte att uppdatera produkten.");
      } finally {
        handleCloseEditProduct();
      }
    }
  };

  const handleCloseEnterNewProductVariant = () => {
    setProductVariantSize("");
    setProductVariantSKU("");
    setProductVariantPriceAsString("");
    setProductVariantStockAsString("");
    setShowEnterNewProductVariant(false);
  };

  const handleCreateNewProductVariant = async (
    productVariantSize: string,
    productVariantSKU: string,
    productVariantPriceAsString: string,
    productVariantStockAsString: string
  ) => {
    const productVariantPrice = Number(productVariantPriceAsString);
    if (isNaN(productVariantPrice)) {
      handleCloseEnterNewProductVariant();
      setError("Skapandet av ny storlek misslyckades. Du måste skriva in ett nummer för priset.");
      return;
    }

    const productVariantStock = Number(productVariantStockAsString);
    if (isNaN(productVariantStock)) {
      handleCloseEnterNewProductVariant();
      setError("Skapandet av ny storlek misslyckades. Du måste skriva in ett nummer för lagersaldot.");
      return;
    }

    const request: CreateNewProductVariantRequest = {
      size: productVariantSize,
      SKU: productVariantSKU,
      price: productVariantPrice,
      stock: productVariantStock,
    };

    try {
      await apiService.createNewProductVariantAsync(id, request);
      setUseEffectTrigger((prev) => prev + 1);
    } catch (err: any) {
      setError(err.message || "Ett oväntat fel inträffade. Det gick inte att skapa produktvarianten.");
    } finally {
      handleCloseEnterNewProductVariant();
    }
  };

  if (!product)
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

  const sex = product.productSex === 0 ? "Unisex" : product.productSex === 1 ? "Man" : "Kvinna";

  return (
    <div className="main-container">
      <Nav />
      <div className="product">
        <h1>{product.name}</h1>
        <p>{sex}</p>
        <p>Från {product.startPrice} kr</p>
        {product.description === "" ? <p>Produkten saknar beskrivning</p> : <p>{product.description}</p>}
        <img src={product.imageUrl} alt={product.name} className="product-large" />

        {!showEditProduct && (
          <div className="press-to-create-new">
            <button onClick={handleShowEditProduct}>Redigera produkt</button>
          </div>
        )}
        {showEditProduct && (
          <div className="create-new">
            <label htmlFor="newproductname">Nytt produktnamn</label>
            <input
              type="text"
              id="newproductname"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
            />

            <label>
              <input type="radio" name="option" value="0" checked={newProductSex === 0} onChange={handleChange} />
              Unisex
            </label>
            <label>
              <input type="radio" name="option" value="1" checked={newProductSex === 1} onChange={handleChange} />
              Man
            </label>
            <label>
              <input type="radio" name="option" value="2" checked={newProductSex === 2} onChange={handleChange} />
              Kvinna
            </label>

            <label htmlFor="newproductdescription">Ny valfri beskrivning av produkten</label>
            <textarea
              id="newproductdescription"
              value={newProductDescription}
              onChange={(e) => setNewProductDescription(e.target.value)}
            />

            <label htmlFor="newimageurl">Ny URL för produktens bild</label>
            <input type="text" id="newimageurl" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />

            <label htmlFor="newproductcolor">Ny produktfärg</label>
            <input
              type="text"
              id="newproductcolor"
              value={newProductColor}
              onChange={(e) => setNewProductColor(e.target.value)}
            />
            <div className="confirm-or-cancel">
              <button
                className="confirm-button"
                onClick={() =>
                  handleEditProduct(newProductName, newProductSex, newProductDescription, newImageUrl, newProductColor)
                }
              >
                OK
              </button>
              <button className="cancel-button" onClick={handleCloseEditProduct}>
                AVBRYT
              </button>
            </div>
          </div>
        )}
        <p>Antal storlekar: {product.productVariants.length}</p>
        <div className="records-container">
          {product.productVariants.length === 0 ? (
            <div className="no-records">
              <p>Inga storlekar har lagts in för produkten</p>
            </div>
          ) : (
            product.productVariants.map((v) => (
              <AdminProductVariant
                productVariantId={v.productVariantId}
                size={v.size}
                SKU={v.SKU}
                price={v.price}
                stock={v.stock}
                productId={id}
                setUseEffectTrigger={setUseEffectTrigger}
              />
            ))
          )}
        </div>
        {!showEnterNewProductVariant && (
          <div className="press-to-create-new">
            <h4>Tryck för att skapa ny storlek</h4>
            <button onClick={() => setShowEnterNewProductVariant(true)}>Skapa</button>
          </div>
        )}
        {showEnterNewProductVariant && (
          <div className="create-new">
            <h3>Skapa en ny storlek</h3>
            <label htmlFor="productvariantsize">Ny storlek</label>
            <input
              type="text"
              id="productvariantsize"
              required
              value={productVariantSize}
              onChange={(e) => setProductVariantSize(e.target.value)}
            />

            <label htmlFor="productvariantsku">SKU</label>
            <input
              type="text"
              id="productvariantsku"
              required
              value={productVariantSKU}
              onChange={(e) => setProductVariantSKU(e.target.value)}
            />

            <label htmlFor="productvariantprice">Pris i kr</label>
            <input
              type="text"
              id="productvariantprice"
              required
              value={productVariantPriceAsString}
              onChange={(e) => setProductVariantPriceAsString(e.target.value)}
            />

            <label htmlFor="productvariantstock">Lagersaldo</label>
            <input
              type="text"
              id="productvariantstock"
              required
              value={productVariantStockAsString}
              onChange={(e) => setProductVariantStockAsString(e.target.value)}
            />
            <div className="confirm-or-cancel">
              <button
                className="confirm-button"
                onClick={() =>
                  handleCreateNewProductVariant(
                    productVariantSize,
                    productVariantSKU,
                    productVariantPriceAsString,
                    productVariantStockAsString
                  )
                }
              >
                OK
              </button>
              <button className="cancel-button" onClick={handleCloseEnterNewProductVariant}>
                AVBRYT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductAdminView;
