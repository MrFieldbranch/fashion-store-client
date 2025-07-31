import type { DetailedOrderResponse } from "../models/DetailedOrderResponse";

type OrderInformationProps = {
  order: DetailedOrderResponse;
};

const OrderInformation = ({ order }: OrderInformationProps) => (
  <>
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
  </>
);

export default OrderInformation;
