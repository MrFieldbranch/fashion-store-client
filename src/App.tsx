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

const App = () => {
  const { userRole } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/start" />} />
      <Route element={<UserLayoutWithSexChoices />}>
        <Route path="/start" element={<StartView />} />
        <Route path="/category/:categoryId/sex/:sex" element={<CategoryView />} />
      </Route>
      <Route element={<UserLayoutWithoutSexChoices />}>
        <Route path="/product/:productId" element={<ProductView />} />
        <Route path="/likedproducts" element={<LikedProductsView />} />
        <Route path="/shoppingbasket" element={<ShoppingBasketView />} />
        <Route path="/payment" element={<PaymentView />} />
        <Route path="/confirmation" element={<ConfirmationView />} />
        <Route path="/history/allorders" element={<AllOrdersView />} />
        <Route path="/history/order/:orderId" element={<DetailedOrderView />} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route
          path="/admin/dashboard"
          element={userRole === "Admin" ? <AdminDashboardView /> : <Navigate to="/start" />}
        />
        <Route
          path="/admin/allcategories"
          element={userRole === "Admin" ? <AllCategoriesAdminView /> : <Navigate to="/start" />}
        />
        <Route
          path="/admin/category/:categoryId"
          element={userRole === "Admin" ? <CategoryAdminView /> : <Navigate to="/start" />}
        />
        <Route
          path="/admin/category/:categoryId/product/:productId"
          element={userRole === "Admin" ? <ProductAdminView /> : <Navigate to="/start" />}
        />
        <Route
          path="/admin/allcustomers"
          element={userRole === "Admin" ? <AllCustomersAdminView /> : <Navigate to="/start" />}
        />
        <Route
          path="/admin/user/:userId"
          element={userRole === "Admin" ? <AdminUserView /> : <Navigate to="/start" />}
        />
        <Route
          path="/admin/user/:userId/order/:orderId"
          element={userRole === "Admin" ? <AdminUserOrderView /> : <Navigate to="/start" />}
        />
      </Route>
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

export default App;
