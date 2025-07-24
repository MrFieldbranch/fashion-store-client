import { Outlet } from "react-router-dom";
import NavAdmin from "../components/admin-components/NavAdmin";

const AdminLayout = () => (
  <>
    <NavAdmin />
    <main className="main-container-admin">
      <Outlet />
    </main>
  </>
);

export default AdminLayout;
