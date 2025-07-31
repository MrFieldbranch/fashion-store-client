import { useEffect, useState } from "react";
import type { BasicOrderResponse } from "../models/BasicOrderResponse";
import apiService from "../services/api-service";
import { useNavigate } from "react-router-dom";
import ErrorPopup from "../components/ErrorPopup";

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

  return (
    <>
      {error && <ErrorPopup error={error} setError={setError} />}
      <div className="all-orders">
        <h1>Dina beställningar</h1>
        <table className="table-narrow">
          <thead>
            <tr>
              <th>Ordernummer</th>
              <th>Datum</th>
              <th>Antal artiklar</th>
              <th>Totalbelopp (kr)</th>
            </tr>
          </thead>
          <tbody>
            {allOrdersForUser.length === 0 ? (
              <p>Du har inte gjort några beställningar</p>
            ) : (
              allOrdersForUser.map((o) => (
                <tr key={o.orderId} onClick={() => navigate(`/history/order/${o.orderId}`)}>
                  <td>{o.orderId}</td>
                  <td>{o.orderDate.toISOString().split("T")[0]}</td>
                  <td>{o.totalQuantity}</td>
                  <td>{o.totalAmount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AllOrdersView;
