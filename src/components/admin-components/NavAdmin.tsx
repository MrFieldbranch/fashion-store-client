import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const NavAdmin = () => {
  const { loggedInUserFirstName, logout } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    logout();
    navigate("/start");
  };

  return (
    <nav>
      <button className="nav-option" onClick={() => navigate("/admindashboard")}>
        Admin Dashboard
      </button>
      <div className="logged-in-info-and-logout-button">
        <p>Inloggad som: {loggedInUserFirstName}</p>
        <button className="logout-button" onClick={handleAdminLogout}>
          Logga ut
        </button>
      </div>
    </nav>
  );
};

export default NavAdmin;
