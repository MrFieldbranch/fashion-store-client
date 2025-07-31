import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { OrderListForUserResponse } from "../../models/OrderListForUserResponse";
import apiService from "../../services/api-service";
import ErrorPopup from "../../components/ErrorPopup";

const AdminUserView = () => {
  const { userId } = useParams<{ userId: string }>();
  const id = Number(userId);
  const [orderList, setOrderList] = useState<OrderListForUserResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchOrderList = async () => {
      try {
        const response = await apiService.getOrdersForUserByIdForAdminAsync(id, abortCont.signal);

        if (!abortCont.signal.aborted) {
          setOrderList(response);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Ett oväntat fel inträffade.");
        }
      }
    };

    fetchOrderList();
    return () => abortCont.abort();
  }, []);

  if (!orderList)
    return (
      <div className="loading">
        <p>Laddar...</p>
      </div>
    );

  return (
    <>
      {error && <ErrorPopup error={error} setError={setError} />}
      <div className="admin-user">
        <div className="separate-horizontally">
          <h1>
            Beställningar för:
            <br />
            {orderList.firstName} {orderList.lastName}
          </h1>
          <button className="go-back" onClick={() => navigate("/allcustomersadmin")}>
            Tillbaka
          </button>
        </div>

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
            {orderList.orders.length === 0 ? (
              <p>Kunden har inte gjort några beställningar</p>
            ) : (
              orderList.orders.map((o) => (
                <tr key={o.orderId} onClick={() => navigate(`/admin/user/${id}/order/${o.orderId}`)}>
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

export default AdminUserView;
