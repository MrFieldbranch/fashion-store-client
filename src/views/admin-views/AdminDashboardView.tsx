import { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import type { BasicCategoryResponse } from "../../models/BasicCategoryResponse";
import apiService from "../../services/api-service";
import AdminCategory from "../../components/admin-components/AdminCategory";

const AdminDashboardView = () => {
  const [allCategories, setAllCategories] = useState<BasicCategoryResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchCategories = async () => {
      try {
        const response = await apiService.getAllCategoriesAsync(abortCont.signal);
        setIsLoading(false);
        if (!abortCont.signal.aborted) {
          setAllCategories(response);
          /* setError(null); */
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Ett oväntat fel inträffade.");
        }
      }
    };

    fetchCategories();
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
      <Nav />
      <div className="admin-dashboard">
        <h1>Välkommen till Admin Dashboard</h1>
        <h2>Alla kategorier</h2>
        <div className="all-categories-admin">
          {allCategories.length === 0 ? (
            <div className="no-records">
              <p>Inga kategorier finns</p>
            </div>
          ) : (
            allCategories.map((c) => <AdminCategory key={c.id} categoryId={c.id} categoryName={c.name} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardView;
