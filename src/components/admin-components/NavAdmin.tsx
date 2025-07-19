import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

const NavAdmin = () => {
  const { loggedInUserFirstName, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    logout();
    navigate("/start");
    showToast("Du är nu utloggad. Välkommen åter.");
  };

  return (
    <nav>
      <button className="go-back" onClick={() => navigate("/admindashboard")}>
        Admin Dashboard
      </button>
      <div className="user-info-and-logout-button">
        <p>Inloggad som: {loggedInUserFirstName}</p>
        <button className="logout-button" onClick={handleAdminLogout}>
          Logga ut
        </button>
      </div>
    </nav>
  );
};

export default NavAdmin;
