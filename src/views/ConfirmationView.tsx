import { useLocation, useNavigate } from "react-router-dom";
import type { DetailedOrderResponse } from "../models/DetailedOrderResponse";
import OrderInformation from "../components/OrderInformation";

const ConfirmationView = () => {
  const location = useLocation();
  const order = location.state?.order as DetailedOrderResponse | undefined;
  const navigate = useNavigate();

  if (!order)
    return (
      <div className="non-clickable-background" onClick={(e) => e.stopPropagation()}>
        <div className="pop-up">
          <p>Något gick fel. Ingen beställning kunde hittas.</p>
          <button className="button-white" onClick={() => navigate("/start")}>
            Till startsidan
          </button>
        </div>
      </div>
    );

  // Bryta ut till komponent?
  return (
    <div className="confirmation">
      <h1>Allt klart! Tack för ditt köp!</h1>
      <OrderInformation order={order} />
    </div>
  );
};

export default ConfirmationView;
