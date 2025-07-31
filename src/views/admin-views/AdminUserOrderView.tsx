import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { DetailedOrderResponse } from "../../models/DetailedOrderResponse";
import apiService from "../../services/api-service";

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

  if (error)
    return (
      <div className="non-clickable-background" onClick={(e) => e.stopPropagation()}>
        <div className="pop-up">
          <p>{error}</p>
          <button className="go-back" onClick={() => setError(null)}>
            Tillbaka
          </button>
        </div>
      </div>
    );

  return (
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
      <div className="order-summary">
        <p>Ordernummer: {order.orderId}</p>
        <p>Totalbelopp: {order.totalAmount} kr</p>
        <p>Beställningsdatum: {order.orderDate.toISOString().split("T")[0]}</p>
      </div>
      <div className="table">
        {order.items.map((i) => (
          <div className="row-in-table" key={i.productVariantId}>
            <img src={i.imageUrl} alt={i.productName} className="product-tiny-img" />
            <div className="name-color-size">
              <p>{i.productName}</p>
              <p>{i.color}</p>
              <p>{i.size}</p>
            </div>
            <p>{i.priceAtPurchaseTime} kr/st</p>
            <p>{i.quantity} st</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUserOrderView;
