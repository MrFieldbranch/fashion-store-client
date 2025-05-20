import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const { loggedInUserFirstName, userRole, logout } = useAuth();
  const [loginWindowOpen, setLoginWindowOpen] = useState<boolean>(false);
  const [registerWindowOpen, setRegisterWindowOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  return (
    <nav>
      <h2>Fashion Store</h2>
      {userRole ? (
        <>
          {userRole === "Admin" && <button className="nav-option" onClick={() => navigate("/admindashboard")}>Admin Dashboard</button>}
          <div className="logged-in-info-and-logout-button">
            <p>Inloggad som: {loggedInUserFirstName}</p>
            <button className="logout-button" onClick={logout}>Logga ut</button>
          </div>
        </>
      ) : (
        <div className="login-register-buttons">
          <button className="nav-option" onClick={() => setLoginWindowOpen(true)}>
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
