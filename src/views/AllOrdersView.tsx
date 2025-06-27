import { useEffect, useState } from "react";
import type { BasicOrderResponse } from "../models/BasicOrderResponse";
import apiService from "../services/api-service";
import NavWithoutSexChoices from "../components/NavWithoutSexChoices";
import { useNavigate } from "react-router-dom";

const AllOrdersView = () => {
  const [allOrdersForUser, setAllOrdersForUser] = useState<BasicOrderResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchOrders = async () => {
      try {
        const response = await apiService.getAllOrdersForUserAsync(abortCont.signal);
        setIsLoading(false);
        if (!abortCont.signal.aborted) {
          setAllOrdersForUser(response);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Ett oväntat fel inträffade.");
        }
      }
    };

    fetchOrders();
    return () => abortCont.abort();
  }, []);

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
      <div className="all-orders">
        <h1>Dina beställningar</h1>
        <div className="table-narrow">
          {allOrdersForUser.length === 0 ? (
            <p>Du har inte gjort några beställningar</p>
          ) : (
            allOrdersForUser.map((o) => (
              <div
                className="row-in-narrow-table"
                key={o.orderId}
                onClick={() => navigate(`/history/order/${o.orderId}`)}
              >
                <p>Beställningsnummer: {o.orderId}</p>
                <p>Datum: {o.orderDate.toISOString().split("T")[0]}</p>
                <p>Antal artiklar: {o.totalQuantity}</p>
                <p>Totalbelopp: {o.totalAmount} kr</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AllOrdersView;
