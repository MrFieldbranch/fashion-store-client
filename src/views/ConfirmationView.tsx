import { useLocation } from "react-router-dom";
import NavWithoutSexChoices from "../components/NavWithoutSexChoices";
import type { DetailedOrderResponse } from "../models/DetailedOrderResponse";

const ConfirmationView = () => {
  const location = useLocation();
  const order = location.state?.order as DetailedOrderResponse | undefined;

  if (!order)
    return (
      <div className="main-container">
        <NavWithoutSexChoices />
        <p>Något gick fel. Ingen beställning kunde hittas.</p>
      </div>
    );

// Byt namn på tabellen och innehållet, på båda ställena.

  return (
    <div className="main-container">
      <NavWithoutSexChoices />
      <div className="confirmation">
        <h1>Allt klart! Tack för ditt köp!</h1>
        <p>Ordernummer: {order.orderId}</p>
        <p>Totalbelopp: {order.totalAmount} kr</p>
        <p>Beställningsdatum: {order.orderDate.toISOString().split("T")[0]}</p>
        <div className="shopping-basket-table">
          {order.items.map((i) => (
            <div className="row-in-shopping-basket-table" key={i.productVariantId}>
              <div className="shopping-basket-item-left">
                <img src={i.imageUrl} alt={i.productName} className="product-tiny-img" />
                <div className="name-color-size">
                  <p>{i.productName}</p>
                  <p>{i.color}</p>
                  <p>{i.size}</p>
                </div>
              </div>
              <p>{i.priceAtPurchaseTime} kr/st</p>
			  <p>{i.quantity} st</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationView;
