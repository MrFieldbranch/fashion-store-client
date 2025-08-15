import { useEffect, useState } from "react";
import type { BasicOrderResponse } from "../models/BasicOrderResponse";
import apiService from "../services/api-service";
import { useNavigate } from "react-router-dom";
import ErrorPopup from "../components/ErrorPopup";
/* import type { RatingReminderResponse } from "../models/RatingReminderResponse"; */
import { useRatingReminder } from "../contexts/RatingReminderContext";

const AllOrdersView = () => {
  const { ratingReminders, refreshRatingReminders } = useRatingReminder();
  const [allOrdersForUser, setAllOrdersForUser] = useState<BasicOrderResponse[]>([]);
  /* const [ratingReminders, setRatingReminders] = useState<RatingReminderResponse[]>([]); */
  const [error, setError] = useState<string | null>(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(true);
  /* const [isLoadingReminders, setIsLoadingReminders] = useState<boolean>(true); */
  /* const [useEffectTrigger, setUseEffectTrigger] = useState<number>(1); */
  const navigate = useNavigate();

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchOrders = async () => {
      try {
        const response = await apiService.getAllOrdersForUserAsync(abortCont.signal);
        if (!abortCont.signal.aborted) {
          setAllOrdersForUser(response);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Ett oväntat fel inträffade.");
        }
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchOrders();
    return () => abortCont.abort();
  }, []);

  /* useEffect(() => {
    const abortCont = new AbortController();

    const fetchRatingReminders = async () => {
      try {
        const response = await apiService.getRatingRemindersAsync(abortCont.signal);
        if (!abortCont.signal.aborted) {
          setRatingReminders(response);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Ett oväntat fel inträffade.");
        }
      } finally {
        setIsLoadingReminders(false);
      }
    };

    fetchRatingReminders();
    return () => abortCont.abort();
  }, [useEffectTrigger]); */

  const handleDeclineRating = async () => {
    try {
      await apiService.markAllRemindersAsAnsweredAsync();
      /* setUseEffectTrigger((prev) => prev + 1); */
      refreshRatingReminders();
    } catch (err: any) {
      setError(err.message || "Ett oväntat fel inträffade. Det gick inte att markera alla påminnelser som besvarade.");
    }
  };

  if (isLoadingOrders)
    return (
      <div className="loading">
        <p>Laddar...</p>
      </div>
    );

  return (
    <>
      {error && <ErrorPopup error={error} setError={setError} />}
      {ratingReminders.length > 0 && (
        <div className="new-ratings-announcement">
          {ratingReminders.length > 1 ? (
            <h3>
              Du har nyligen köpt
              <br />
              {ratingReminders.length} produkter av oss.
              <br />
              Skulle du vilja hjälpa oss
              <br />
              genom att betygsätta dem?
            </h3>
          ) : (
            <h3>
              Du har nyligen köpt
              <br />
              en produkt av oss.
              <br />
              Skulle du vilja hjälpa oss
              <br />
              genom att betygsätta den?
            </h3>
          )}
          <div className="confirm-or-cancel">
            <button className="confirm-button" onClick={() => navigate("/ratings-and-reviews")}>
              OK
            </button>
            <button className="cancel-button" onClick={handleDeclineRating}>
              NEJ
            </button>
          </div>
        </div>
      )}
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
