import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../services/api-service";
import type { DetailedOrderResponse } from "../models/DetailedOrderResponse";
import ErrorPopup from "../components/ErrorPopup";
import OrderInformation from "../components/OrderInformation";

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

  // Bryta ut till komponent?
  return (
    <>
      {error && <ErrorPopup error={error} setError={setError} />}
      <div className="detailed-order">
        <div className="separate-horizontally">
          <h1>Orderinformation</h1>
          <button className="button-white" onClick={() => navigate("/history/allorders")}>
            Tillbaka
          </button>
        </div>
        <OrderInformation order={order} />
      </div>
    </>
  );
};

export default DetailedOrderView;
