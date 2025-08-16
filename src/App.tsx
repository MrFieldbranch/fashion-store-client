import { Navigate, Route, Routes } from "react-router-dom";
import StartView from "./views/StartView";
import NotFoundView from "./views/NotFoundView";
import AdminDashboardView from "./views/admin-views/AdminDashboardView";
import { useAuth } from "./contexts/AuthContext";
import CategoryAdminView from "./views/admin-views/CategoryAdminView";
import ProductAdminView from "./views/admin-views/ProductAdminView";
import CategoryView from "./views/CategoryView";
import ProductView from "./views/ProductView";
import LikedProductsView from "./views/LikedProductsView";
import ShoppingBasketView from "./views/ShoppingBasketView";
import PaymentView from "./views/PaymentView";
import ConfirmationView from "./views/ConfirmationView";
import AllOrdersView from "./views/AllOrdersView";
import DetailedOrderView from "./views/DetailedOrderView";
import UserLayoutWithSexChoices from "./layouts/UserLayoutWithSexChoices";
import UserLayoutWithoutSexChoices from "./layouts/UserLayoutWithoutSexChoices";
import AdminLayout from "./layouts/AdminLayout";
import AllCategoriesAdminView from "./views/admin-views/AllCategoriesAdminView";
import AllCustomersAdminView from "./views/admin-views/AllCustomersAdminView";
import AdminUserView from "./views/admin-views/AdminUserView";
import AdminUserOrderView from "./views/admin-views/AdminUserOrderView";
import RatingsAndReviewsView from "./views/RatingsAndReviewsView";

const App = () => {
  const { userRole, hydrated } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/start" />} />
      <Route element={<UserLayoutWithSexChoices />}>
        <Route path="/start" element={!hydrated ? null : <StartView />} />
        <Route path="/category/:categoryId/sex/:sex" element={!hydrated ? null : <CategoryView />} />
      </Route>
      <Route element={<UserLayoutWithoutSexChoices />}>
        <Route path="/product/:productId" element={!hydrated ? null : <ProductView />} />
        <Route
          path="/likedproducts"
          element={!hydrated ? null : userRole === "User" ? <LikedProductsView /> : <Navigate to="/start" />}
        />
        <Route
          path="/shoppingbasket"
          element={!hydrated ? null : userRole === "User" ? <ShoppingBasketView /> : <Navigate to="/start" />}
        />
        <Route
          path="/payment"
          element={!hydrated ? null : userRole === "User" ? <PaymentView /> : <Navigate to="/start" />}
        />
        <Route
          path="/confirmation"
          element={!hydrated ? null : userRole === "User" ? <ConfirmationView /> : <Navigate to="/start" />}
        />
        <Route
          path="/history/allorders"
          element={!hydrated ? null : userRole === "User" ? <AllOrdersView /> : <Navigate to="/start" />}
        />
        <Route
          path="/history/order/:orderId"
          element={!hydrated ? null : userRole === "User" ? <DetailedOrderView /> : <Navigate to="/start" />}
        />
        <Route
          path="/ratings-and-reviews"
          element={!hydrated ? null : userRole === "User" ? <RatingsAndReviewsView /> : <Navigate to="/start" />}
        />
      </Route>
      <Route element={<AdminLayout />}>
        <Route
          path="/admin/dashboard"
          element={!hydrated ? null : userRole === "Admin" ? <AdminDashboardView /> : <Navigate to="/start" />}
        />
        <Route
          path="/admin/allcategories"
          element={!hydrated ? null : userRole === "Admin" ? <AllCategoriesAdminView /> : <Navigate to="/start" />}
        />
        <Route
          path="/admin/category/:categoryId"
          element={!hydrated ? null : userRole === "Admin" ? <CategoryAdminView /> : <Navigate to="/start" />}
        />
        <Route
          path="/admin/category/:categoryId/product/:productId"
          element={!hydrated ? null : userRole === "Admin" ? <ProductAdminView /> : <Navigate to="/start" />}
        />
        <Route
          path="/admin/allcustomers"
          element={!hydrated ? null : userRole === "Admin" ? <AllCustomersAdminView /> : <Navigate to="/start" />}
        />
        <Route
          path="/admin/user/:userId"
          element={!hydrated ? null : userRole === "Admin" ? <AdminUserView /> : <Navigate to="/start" />}
        />
        <Route
          path="/admin/user/:userId/order/:orderId"
          element={!hydrated ? null : userRole === "Admin" ? <AdminUserOrderView /> : <Navigate to="/start" />}
        />
      </Route>
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

export default App;
