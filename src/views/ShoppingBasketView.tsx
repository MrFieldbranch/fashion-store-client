import { useEffect, useState } from "react";
import NavWithoutSexChoices from "../components/NavWithoutSexChoices";
import { useShoppingBasket } from "../contexts/ShoppingBasketContext";
import apiService from "../services/api-service";
import type { RemoveItemFromShoppingBasketRequest } from "../models/RemoveItemFromShoppingBasketRequest";
import type { ShoppingBasketItemResponse } from "../models/ShoppingBasketItemResponse";
import type { ChangeQuantityRequest } from "../models/ChangeQuantityRequest";

const quantityChoices = [1, 2, 3, 4, 5];

const ShoppingBasketView = () => {
  const { triggerRefresh } = useShoppingBasket();
  const [items, setItems] = useState<ShoppingBasketItemResponse[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [useEffectTrigger, setUseEffectTrigger] = useState<number>(1);

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
      triggerRefresh();
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
      triggerRefresh();
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
      <NavWithoutSexChoices />
      <div className="shopping-basket">
        <h1>Varukorg</h1>
        <div className="shopping-basket-table">
          {items.length === 0 ? (
            <p>Du har inga varor i varukorgen</p>
          ) : (
            items.map((i) => (
              <div className="row-in-shopping-basket-table" key={i.productVariantId}>
                <div className="shopping-basket-item-left">
                  <img src={i.imageUrl} alt={i.productName} className="product-tiny-img" />
                  <div className="name-color-size">
                    <p>{i.productName}</p>
                    <p>{i.color}</p>
                    <p>{i.size}</p>
                  </div>
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
            ))
          )}
        </div>
        <div className="total-amount">
          <h2>TOTALT</h2>
          {items.length === 0 ? <p>0 kr</p> : <p>{totalAmount} kr</p>}
        </div>
      </div>
    </div>
  );
};

export default ShoppingBasketView;
// Hur ska jag få med quantity? Att det ska vara 1 från början, och att det ska ändras
// för varje productVariant när användaren ändrar.
// Hur och var räknar jag ut totalsumman (som bara är till för klienten, för att visa användaren, skickas alltså inte till API:et)?
// Jag vet inte om det skulle underlätta att ha med quantity för ShoppingBasketItem, att det sätts till 1 från början, när man lägger i varukorgen.
// Undersök detta. Det kanske gör allt mycket enklare.
// Det måste vara någon slags onClick (eller onChange, som det är nu). När detta sker så ska en request skickas till backend.
