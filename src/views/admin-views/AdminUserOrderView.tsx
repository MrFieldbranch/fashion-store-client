import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { DetailedOrderResponse } from "../../models/DetailedOrderResponse";
import apiService from "../../services/api-service";
import ErrorPopup from "../../components/ErrorPopup";
import OrderInformation from "../../components/OrderInformation";

const AdminUserOrderView = () => {
  // Hur gör jag med Tillbaka? Eftersom det är useParams.
  const { userId, orderId } = useParams<{ userId: string; orderId: string }>();
  const userIdNumber = Number(userId);
  const orderIdNumber = Number(orderId);
  const [order, setOrder] = useState<DetailedOrderResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchOrder = async () => {
      try {
        const response = await apiService.getOrderByIdForAdminAsync(userIdNumber, orderIdNumber, abortCont.signal);

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
  }, []);

  if (!order)
    return (
      <div className="loading">
        <p>Laddar...</p>
      </div>
    );

  return (
    <>
      {error && <ErrorPopup error={error} setError={setError} />}
      <div className="admin-user-order">
        <div className="separate-horizontally">
          <h1>Orderinformation</h1>
          <button className="go-back" onClick={() => navigate(`/admin/user/${userIdNumber}`)}>
            Tillbaka
          </button>
        </div>
        <h2>
          Kund: {order.firstName ?? ""} {order.lastName ?? ""}
        </h2>
        <OrderInformation order={order} />
      </div>
    </>
  );
};

export default AdminUserOrderView;
