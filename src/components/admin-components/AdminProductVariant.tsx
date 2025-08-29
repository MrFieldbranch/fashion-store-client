import React, { useState } from "react";
import type { UpdateProductVariantRequest } from "../../models/UpdateProductVariantRequest";
import apiService from "../../services/api-service";

type AdminProductVariantProps = {
  productVariantId: number;
  size: string;
  sku: string;
  price: number;
  stock: number;
  productId: number;
  setUseEffectTrigger: React.Dispatch<React.SetStateAction<number>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};
// Jag kan antagligen inte ändra pris eller lagersaldo. Ändra till string?
const AdminProductVariant = ({
  productVariantId,
  size,
  sku,
  price,
  stock,
  productId,
  setUseEffectTrigger,
  setError
}: AdminProductVariantProps) => {
  const [showEditProductVariant, setShowEditProductVariant] = useState<boolean>(false);
  const [newPriceAsString, setNewPriceAsString] = useState<string>(price.toString());
  const [stockChangeAsString, setStockChangeAsString] = useState<string>("0");  

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

  return (
    <div className="admin-record">
      <h3>{size}</h3>
      <p>{sku}</p>
      <p>{price} kr</p>
      <p>Antal i lager: {stock}</p>
      {!showEditProductVariant && (
        <button className="button-purple" onClick={() => setShowEditProductVariant(true)}>
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
              className="button-green"
              onClick={() => handleEditProductVariant(newPriceAsString, stockChangeAsString)}
            >
              OK
            </button>
            <button className="button-red" onClick={handleCloseEditProductVariant}>
              AVBRYT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductVariant;
