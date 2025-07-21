import { useLocation, useNavigate } from "react-router-dom";
import type { DetailedOrderResponse } from "../models/DetailedOrderResponse";

const ConfirmationView = () => {
  const location = useLocation();
  const order = location.state?.order as DetailedOrderResponse | undefined;
  const navigate = useNavigate();

  if (!order)
    return (
      <div className="non-clickable-background" onClick={(e) => e.stopPropagation()}>
        <div className="pop-up">
          <p>Något gick fel. Ingen beställning kunde hittas.</p>
          <button className="go-back" onClick={() => navigate("/start")}>
            Till startsidan
          </button>
        </div>
      </div>
    );

  /* return (
      <>
        <NavWithoutSexChoices />
        <div className="main-container">
          <p>Något gick fel. Ingen beställning kunde hittas.</p>
        </div>
      </>
    ); */

  // Bryta ut till komponent?
  return (
    <div className="confirmation">
      <h1>Allt klart! Tack för ditt köp!</h1>
      <div className="order-summary">
        <p>Ordernummer: {order.orderId}</p>
        <p>Totalbelopp: {order.totalAmount} kr</p>
        <p>Beställningsdatum: {order.orderDate.toISOString().split("T")[0]}</p>
      </div>
      <div className="table">
        {order.items.map((i) => (
          <div className="row-in-table" key={i.productVariantId}>
            <div className="row-in-table-left-side">
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
  );
};

export default ConfirmationView;
