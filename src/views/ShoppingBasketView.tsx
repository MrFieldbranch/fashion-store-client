import { useEffect, useState } from "react";
import { useShoppingBasket } from "../contexts/ShoppingBasketContext";
import apiService from "../services/api-service";
import type { RemoveItemFromShoppingBasketRequest } from "../models/RemoveItemFromShoppingBasketRequest";
import type { ShoppingBasketItemResponse } from "../models/ShoppingBasketItemResponse";
import type { ChangeQuantityRequest } from "../models/ChangeQuantityRequest";
import { useNavigate } from "react-router-dom";
import ErrorPopup from "../components/ErrorPopup";

const quantityChoices = [1, 2, 3, 4, 5];

const ShoppingBasketView = () => {
  const { refreshShoppingBasketInNav } = useShoppingBasket();
  const [items, setItems] = useState<ShoppingBasketItemResponse[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [useEffectTrigger, setUseEffectTrigger] = useState<number>(1);

  const navigate = useNavigate();

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchShoppingBasket = async () => {
      try {
        const response = await apiService.getShoppingBasketAsync(abortCont.signal);
        setIsLoading(false);
        if (!abortCont.signal.aborted) {
          setItems(response.items);
          setTotalAmount(response.totalAmount);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Ett oväntat fel inträffade.");
        }
      }
    };

    fetchShoppingBasket();
    return () => abortCont.abort();
  }, [useEffectTrigger]);

  const handleRemoveItem = async (productVariantId: number) => {
    const request: RemoveItemFromShoppingBasketRequest = {
      productVariantId: productVariantId,
    };
    try {
      await apiService.removeItemFromShoppingBasketAsync(request);
      refreshShoppingBasketInNav();
      setUseEffectTrigger((prev) => prev + 1);
    } catch (err: any) {
      setError(err.message || "Ett oväntat fel inträffade. Det gick inte att ta bort varan från varukorgen.");
    }
  };

  const handleChangeQuantity = async (e: React.ChangeEvent<HTMLSelectElement>, productVariantId: number) => {
    const newQuantity = Number(e.target.value);
    const request: ChangeQuantityRequest = {
      newQuantity: newQuantity,
    };
    try {
      await apiService.changeQuantityAsync(productVariantId, request);
      setUseEffectTrigger((prev) => prev + 1);
      refreshShoppingBasketInNav();
    } catch (err: any) {
      setError(err.message || "Ett fel inträffade. Det gick inte att ändra antalet.");
    }
  };

  if (isLoading)
    return (
      <div className="loading">
        <p>Laddar...</p>
      </div>
    );

  return (
    <>
      {error && <ErrorPopup error={error} setError={setError} />}
      <div className="shopping-basket">
        <h1>Varukorg</h1>
        <div className="table">
          {items.length === 0 ? (
            <p>Du har inga varor i varukorgen</p>
          ) : (
            <>
              {items.map((i) => (
                <div className="row-in-table" key={i.productVariantId}>
                  <img src={i.imageUrl} alt={i.productName} className="product-tiny-img" />
                  <div className="name-color-size">
                    <p>{i.productName}</p>
                    <p>{i.color}</p>
                    <p>{i.size}</p>
                  </div>
                  <p>{i.price} kr</p>
                  <select
                    className="quantity-dropdown"
                    value={i.quantity}
                    onChange={(e) => handleChangeQuantity(e, i.productVariantId)}
                  >
                    {quantityChoices.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                  <button
                    className="remove-item-from-shopping-basket"
                    onClick={() => handleRemoveItem(i.productVariantId)}
                  >
                    X
                  </button>
                </div>
              ))}
              <div className="total-amount">
                <h2>TOTALT</h2>
                <p>{totalAmount} kr</p>
              </div>
              <div className="go-to-payment">
                <button className="go-to-payment-button" onClick={() => navigate("/payment")}>
                  Gå till betalning
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ShoppingBasketView;
