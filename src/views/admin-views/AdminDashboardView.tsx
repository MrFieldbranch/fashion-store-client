import { useNavigate } from "react-router-dom";

const AdminDashboardView = () => {
  const navigate = useNavigate();
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="wrap-container-admin">
        <button className="item" onClick={() => navigate("/admin/allcategories")}>
          Kategorier
        </button>
        <button className="item" onClick={() => navigate("/admin/allcustomers")}>
          Kunder
        </button>
      </div>
    </div>
  );
};

export default AdminDashboardView;
