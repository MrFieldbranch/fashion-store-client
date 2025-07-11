import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useSex, type Sex } from "../contexts/SexContext";
import type { BasicCategoryResponse } from "../models/BasicCategoryResponse";
import apiService from "../services/api-service";
import { useLikedProducts } from "../contexts/LikedProductsContext";
import { useShoppingBasket } from "../contexts/ShoppingBasketContext";

const Nav = () => {
  const { sex, setSex } = useSex();
  const { categoryId } = useParams<{ categoryId: string }>();
  const { loggedInUserFirstName, userRole, logout } = useAuth();
  const { likedProductsCountInNav } = useLikedProducts();
  const { totalQuantityInShoppingBasket } = useShoppingBasket();
  const [loginWindowOpen, setLoginWindowOpen] = useState<boolean>(false);
  const [registerWindowOpen, setRegisterWindowOpen] = useState<boolean>(false);
  const [showCategories, setShowCategories] = useState<boolean>(false);
  const [allCategoriesBasedOnSex, setAllCategoriesBasedOnSex] = useState<BasicCategoryResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleShowCategories = async () => {
    if (!sex) {
      setError("Inget kön är valt.");
      return;
    }
    const abortCont = new AbortController();
    setIsLoading(true); // Kommer denna att märkas ens?
    try {
      const response = await apiService.getAllCategoriesBySexAsync(sex, abortCont.signal);
      setIsLoading(false);
      if (!abortCont.signal.aborted) {
        setAllCategoriesBasedOnSex(response);
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message || "Ett oväntat fel inträffade.");
      }
    }
    setShowCategories(true);
  };

  const handleSexChange = (newSex: Sex) => {
    //Här?
    setSex(newSex); // keep context in sync
    if (categoryId) {
      navigate(`/category/${categoryId}/sex/${newSex}`);
    }
  };

  const handleNavigateToCategory = (categoryId: number) => {
    // Här då?
    setShowCategories(false);
    navigate(`/category/${categoryId}/sex/${sex}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/start");
  };

  const sexCategory = sex === "Male" ? "män" : sex === "Female" ? "kvinnor" : sex === "Unisex" ? "unisex" : "ditt val";

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
    <nav>
      <div className="brand-name-and-sex-choices">
        {/* <h2 id="home-link" onClick={() => navigate("/start")}>
          Fashion Store
        </h2> */}
        <img src="/images/logo.png" alt="Logo för Fancy Fashion" id="home-link" onClick={() => navigate("/start")} />
        <div className="sex-choices">
          <button
            className={`sex-choice-button ${sex === "Male" ? "selected-sex" : ""}`}
            onClick={() => handleSexChange("Male")}
          >
            Man
          </button>
          <button
            className={`sex-choice-button ${sex === "Female" ? "selected-sex" : ""}`}
            onClick={() => handleSexChange("Female")}
          >
            Kvinna
          </button>
          <button
            className={`sex-choice-button ${sex === "Unisex" ? "selected-sex" : ""}`}
            onClick={() => handleSexChange("Unisex")}
          >
            Unisex
          </button>
        </div>
      </div>

      {sex && !showCategories && (
        <button className="button-to-open-categories" onClick={handleShowCategories}>
          Kategorier
        </button>
      )}
      {sex && showCategories && (
        <div className="clickable-background" onClick={() => setShowCategories(false)}>
          <div className="dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="dropdown-left-side">
              <h2>Kategorier: {sexCategory}</h2>
              <div className="dropdown-left-side-categories">
                {allCategoriesBasedOnSex.length === 0 ? (
                  <p className="no-categories-exist">Inga kategorier finns för {sexCategory}</p>
                ) : (
                  allCategoriesBasedOnSex.map((c) => (
                    <div className="category-in-dropdown" key={c.id} onClick={() => handleNavigateToCategory(c.id)}>
                      {c.name}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="dropdown-right-side">
              <button className="close-dropdown" onClick={() => setShowCategories(false)}>
                Stäng
              </button>
            </div>
          </div>
        </div>
      )}

      {userRole ? (
        <div className="user-info-and-logout-button">
          <div className="heart-icon-nav-wrapper" onClick={() => navigate("/likedproducts")}>
            <img src="/images/heart-for-nav.png" alt="heart for nav" className="heart-icon-nav" />
            <p className="heart-icon-nav-number">{likedProductsCountInNav}</p>
          </div>
          <div className="shopping-basket-icon-nav-wrapper" onClick={() => navigate("/shoppingbasket")}>
            <img src="/images/shopping-basket.png" alt="shopping basket for nav" className="shopping-basket-nav" />
            <p className="shopping-basket-nav-number">{totalQuantityInShoppingBasket}</p>
          </div>
          <div className="avatar-wrapper" onClick={() => navigate("/history/allorders")}>
            <img src="/images/avatar.png" alt="user avatar" className="avatar-nav" />
            <span className="avatar-tooltip">{loggedInUserFirstName}</span>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logga ut
          </button>
        </div>
      ) : (
        <div className="login-register-buttons">
          <button className="login-button" onClick={() => setLoginWindowOpen(true)}>
            Logga in
          </button>
          <button className="register-button" onClick={() => setRegisterWindowOpen(true)}>
            Skapa ett konto
          </button>
        </div>
      )}
      {loginWindowOpen && <Login setLoginWindowOpen={setLoginWindowOpen} />}
      {registerWindowOpen && <Register setRegisterWindowOpen={setRegisterWindowOpen} />}
    </nav>
  );
};

export default Nav;
