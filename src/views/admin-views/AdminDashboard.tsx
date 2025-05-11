import NavAdmin from "../../components/admin-components/NavAdmin";

const AdminDashboard = () => {
  return (
    <div className="main-container">
      <NavAdmin />
      <div className="admin-dashboard">
        <h1>Välkommen till Admin Dashboard</h1>
      </div>
    </div>
  );
};

export default AdminDashboard;
