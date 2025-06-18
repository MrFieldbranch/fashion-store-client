import { useEffect, useState } from "react";
import NavWithoutSexChoices from "../components/NavWithoutSexChoices";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api-service";
import { useAuth } from "../contexts/AuthContext";

const PaymentView = () => {
  const { loggedInUserFirstName, loggedInUserLastName } = useAuth();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchTotalamount = async () => {
      try {
        const response = await apiService.getShoppingBasketTotalAmountAsync(abortCont.signal);
        setIsLoading(false);
        if (!abortCont.signal.aborted) {
          setTotalAmount(response.totalAmount);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Ett oväntat fel inträffade.");
        }
      }
    };

    fetchTotalamount();
    return () => abortCont.abort();
  }, []);

  const handleConfirmPurchase = async () => {
    try {
      const order = await apiService.createOrderAsync();
      navigate("/confirmation", { state: { order } });
    } catch (err: any) {
      setError(err.message || "Ett fel inträffade. Det gick inte att bekräfta köpet.");
    }
  };

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
      <div className="payment">
        <div className="payment-upper">
          <h1>Avsluta köp</h1>
          <button className="go-back" onClick={() => navigate("/shoppingbasket")}>
            Tillbaka till varukorgen
          </button>
        </div>
        <div className="payment-upper">
          <h2 className="total-amount-payment">Totalbelopp</h2>
          <p className="total-amount-payment">{totalAmount} kr</p>
        </div>
        <p className="credit-card-description">OBS: Fiktivt kortnummer</p>
        <div className="credit-card">
          <div id="credit-card-row-1">
            <p className="credit-card-larger-text">1234 5678 1234 5678</p>
          </div>
          <div id="credit-card-row-2">
            <div className="separate-label-and-value">
              <p className="credit-card-label">
                VALID
                <br />
                THRU
              </p>
              <p className="credit-card-larger-text">06/29</p>
            </div>
            <div className="separate-label-and-value">
              <p className="credit-card-label">
                SECURITY
                <br />
                CODE
              </p>
              <p className="credit-card-larger-text">123</p>
            </div>
          </div>
          <div id="credit-card-row-3">
            <p className="credit-card-larger-text">
              {loggedInUserFirstName} {loggedInUserLastName}
            </p>
          </div>
        </div>
        <div className="confirm-purchase">
          <button className="confirm-purchase-button" onClick={handleConfirmPurchase}>
            Bekräfta köp
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentView;
