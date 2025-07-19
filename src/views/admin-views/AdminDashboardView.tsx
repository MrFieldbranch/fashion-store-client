import { useEffect, useState } from "react";
import type { BasicCategoryResponse } from "../../models/BasicCategoryResponse";
import apiService from "../../services/api-service";
import AdminCategory from "../../components/admin-components/AdminCategory";
import type { CreateNewCategoryRequest } from "../../models/CreateNewCategoryRequest";
import NavAdmin from "../../components/admin-components/NavAdmin";

const AdminDashboardView = () => {
  const [allCategories, setAllCategories] = useState<BasicCategoryResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  /* const [useEffectTrigger, setUseEffectTrigger] = useState<number>(1); */

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

  const handleCreateNewCategory = async (newCategoryName: string) => {
    if (newCategoryName.trim() === "") {
      setError("Skapande av ny kategori misslyckades. Du måste skriva in något.");
      return;
    }

    const newCategoryRequest: CreateNewCategoryRequest = {
      name: newCategoryName,
    };

    try {
      const response: BasicCategoryResponse = await apiService.createNewCategoryAsync(newCategoryRequest);
      setAllCategories((prev) => [...prev, response]);
    } catch (err: any) {
      setError(err.message || "Ett oväntat fel inträffade. Den nya kategorin skapades inte.");
    } finally {
      setNewCategoryName("");
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
          <button className="go-back" onClick={() => setError(null)}>
            Tillbaka
          </button>
        </div>
      </div>
    );

  return (
    <>
      <NavAdmin />
      <div className="main-container">
        <div className="admin-dashboard">
          <h1>Admin Dashboard</h1>
          <h2>Alla kategorier</h2>
          <div className="records-container">
            {allCategories.length === 0 ? (
              <div className="no-records">
                <p>Inga kategorier finns</p>
              </div>
            ) : (
              allCategories.map((c) => <AdminCategory key={c.id} categoryId={c.id} categoryName={c.name} />)
            )}
          </div>
          <div className="create-edit">
            <div className="label-and-input">
              <label htmlFor="categoryname">Nytt kategorinamn</label>
              <input
                type="text"
                id="categoryname"
                required
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <button className="confirm-button" onClick={() => handleCreateNewCategory(newCategoryName)}>
              OK
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardView;
