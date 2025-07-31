import { useEffect, useState } from "react";
import type { UserListResponse } from "../../models/UserListResponse";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/api-service";
import ErrorPopup from "../../components/ErrorPopup";

const AllCustomersAdminView = () => {
  const [userList, setUserList] = useState<UserListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchUserList = async () => {
      try {
        const response = await apiService.getAllUsersForAdminAsync(abortCont.signal);

        if (!abortCont.signal.aborted) {
          setUserList(response);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Ett oväntat fel inträffade.");
        }
      }
    };

    fetchUserList();
    return () => abortCont.abort();
  }, []);

  if (!userList)
    return (
      <div className="loading">
        <p>Laddar...</p>
      </div>
    );

  return (
    <>
      {error && <ErrorPopup error={error} setError={setError} />}
      <div className="all-customers-admin">
        <h1>Alla kunder</h1>
        <p>Antal: {userList.totalNumberOfUsers}</p>
        <table className="table-narrow">
          <thead>
            <tr>
              <th>Namn</th>
              <th>Antal ordrar</th>
              <th>Totalt ordervärde (kr)</th>
            </tr>
          </thead>
          <tbody>
            {userList.totalNumberOfUsers === 0 ? (
              <p>Det finns inga kunder i systemet</p>
            ) : (
              userList.users.map((u) => (
                <tr key={u.userId} onClick={() => navigate(`/admin/user/${u.userId}`)}>
                  <td>
                    {u.firstName} {u.lastName}
                  </td>
                  <td>{u.orderCount}</td>
                  <td>{u.totalOrderValueForUser}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AllCustomersAdminView;
