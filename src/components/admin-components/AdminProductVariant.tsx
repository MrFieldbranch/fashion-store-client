import React, { useState } from "react";
import type { UpdateProductVariantRequest } from "../../models/UpdateProductVariantRequest";
import apiService from "../../services/api-service";

type AdminProductVariantProps = {
  productVariantId: number;
  size: string;
  SKU: string;
  price: number;
  stock: number;
  productId: number;
  setUseEffectTrigger: React.Dispatch<React.SetStateAction<number>>;
};
// Jag kan antagligen inte ändra pris eller lagersaldo. Ändra till string?
const AdminProductVariant = ({
  productVariantId,
  size,
  SKU,
  price,
  stock,
  productId,
  setUseEffectTrigger,
}: AdminProductVariantProps) => {
  const [showEditProductVariant, setShowEditProductVariant] = useState<boolean>(false);
  const [newPriceAsString, setNewPriceAsString] = useState<string>(price.toString());
  const [stockChangeAsString, setStockChangeAsString] = useState<string>("0");
  const [error, setError] = useState<string | null>(null);

  const handleCloseEditProductVariant = () => {
    setNewPriceAsString(price.toString()); // Är detta rätt?
    setStockChangeAsString("0");
    setShowEditProductVariant(false);
  };

  const handleEditProductVariant = async (newPriceAsString: string, stockChangeAsString: string) => {
    newPriceAsString = newPriceAsString.trim();
    stockChangeAsString = stockChangeAsString.trim();

    const isUnchanged = newPriceAsString === price.toString() && stockChangeAsString === "0";

    if (isUnchanged) {
      handleCloseEditProductVariant();
      setError("Förfrågan skickades inte, eftersom du inte har gjort några ändringar.");
      return;
    }

    const newPrice = Number(newPriceAsString);
    const stockChange = Number(stockChangeAsString);

    if (isNaN(newPrice)) {
      handleCloseEditProductVariant();
      setError("Ändringen misslyckades. Du måste skriva in ett nummer för priset.");
      return;
    }

    if (isNaN(stockChange)) {
      handleCloseEditProductVariant();
      setError("Ändringen misslyckades. Du måste skriva in ett nummer för ändringen av lagersaldot.");
      return;
    }

    const request: UpdateProductVariantRequest = {
      productVariantId: productVariantId,
      newPrice: newPrice,
      stockChange: stockChange,
    };

    try {
      await apiService.updateExistingProductVariantAsync(productId, request);
      setUseEffectTrigger((prev) => prev + 1);
    } catch (err: any) {
      setError(err.message || "Ett oväntat fel inträffade. Det gick inte att uppdatera produktvarianten.");
    } finally {
      handleCloseEditProductVariant();
    }
  };

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
    <div className="admin-record">
      <h3>{size}</h3>
      <p>{SKU}</p>
      <p>{price} kr</p>
      <p>Antal i lager: {stock}</p>
      {!showEditProductVariant && (
        <button className="press-to-create-edit" onClick={() => setShowEditProductVariant(true)}>
          Redigera storlek
        </button>
      )}
      {showEditProductVariant && (
        <div className="create-edit">
          <div className="label-and-input">
            <label htmlFor="newprice">Nytt pris i kr</label>
            <input
              type="text"
              id="newprice"
              value={newPriceAsString}
              onChange={(e) => setNewPriceAsString(e.target.value)}
            />
          </div>

          <div className="label-and-input">
            <label htmlFor="stockchange">Antal nya (minus för antal förlorade)</label>
            <input
              type="text"
              id="stockchange"
              value={stockChangeAsString}
              onChange={(e) => setStockChangeAsString(e.target.value)}
            />
          </div>

          <div className="confirm-or-cancel">
            <button
              className="confirm-button"
              onClick={() => handleEditProductVariant(newPriceAsString, stockChangeAsString)}
            >
              OK
            </button>
            <button className="cancel-button" onClick={handleCloseEditProductVariant}>
              AVBRYT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductVariant;
