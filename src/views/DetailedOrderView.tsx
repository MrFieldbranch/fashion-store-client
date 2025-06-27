import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../services/api-service";
import type { DetailedOrderResponse } from "../models/DetailedOrderResponse";
import NavWithoutSexChoices from "../components/NavWithoutSexChoices";

const DetailedOrderView = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const id = Number(orderId);
  const [order, setOrder] = useState<DetailedOrderResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchOrder = async () => {
      try {
        const response = await apiService.getOrderByIdAsync(id, abortCont.signal);

        if (!abortCont.signal.aborted) {
          setOrder(response);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Ett oväntat fel inträffade.");
        }
      }
    };

    fetchOrder();
    return () => abortCont.abort();
  }, [id]);

  if (!order)
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

  // Bryta ut till komponent?
  return (
    <div className="main-container">
      <NavWithoutSexChoices />
      <div className="detailed-order">
        <div className="separate-horizontally">
          <h1>Beställningsinformation</h1>
          <button className="go-back" onClick={() => navigate("/history/allorders")}>
            Tillbaka
          </button>
        </div>
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
    </div>
  );
};

export default DetailedOrderView;
