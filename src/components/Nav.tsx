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
          <p>Inloggad som: {loggedInUserFirstName}</p>
          {userRole === "Admin" && <button onClick={() => navigate("/admindashboard")}>Admin Dashboard</button>}
          <button onClick={logout}>Logga ut</button>
        </>
      ) : (
        <>
          <button onClick={() => setLoginWindowOpen(true)}>Logga in</button>
          <button onClick={() => setRegisterWindowOpen(true)}>Skapa ett konto</button>
        </>
      )}
      {loginWindowOpen && <Login setLoginWindowOpen={setLoginWindowOpen} />}
      {registerWindowOpen && <Register setRegisterWindowOpen={setRegisterWindowOpen} />}
    </nav>
  );
};

export default Nav;
