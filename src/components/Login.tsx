import { useState } from "react";
import type { LoginRequest } from "../models/LoginRequest";
import type { TokenResponse } from "../models/TokenResponse";
import apiService from "../services/api-service";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type LoginProps = {
  setLoginWindowOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Login = ({ setLoginWindowOpen }: LoginProps) => {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    const loginRequest: LoginRequest = {
      email: email,
      password: password,
    };
    try {
      const loginResponse: TokenResponse = await apiService.loginAsync(loginRequest);
      apiService.setAuthorizationHeader(loginResponse.token);
      const decodedToken: any = jwtDecode(loginResponse.token);
      const userId = decodedToken.nameid;
      const userName = loginResponse.firstName;
      const role = decodedToken.role; /* Skippar || "User" eftersom det finns väl i role? */
      login(userId, userName, loginResponse.token, role);      
      if (role === "Admin") navigate("/admindashboard");
      else setLoginWindowOpen(false);      
    } catch (err: any) {
      setLoginWindowOpen(false);
      setError(err.message || "Ett oväntat fel inträffade. Inloggningen misslyckades.");
    }
  };

  const handleLoginError = () => {
    setEmail("");
    setPassword("");
    setError(null);
  };

  if (error)
    return (
      <div className="pop-up">
        <p>{error}</p>
        <button onClick={handleLoginError}>Tillbaka</button>
      </div>
    );

  return (
    <div className="pop-up">
      <div className="label-and-input">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          autoComplete="off"
          id="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="label-and-input">
        <label htmlFor="password">Lösenord</label>
        <input type="password" id="password" value={password} required onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="confirm-or-cancel">
        <button className="confirm-button" onClick={() => handleLogin(email, password)}>
          OK
        </button>
        <button className="cancel-button" onClick={() => setLoginWindowOpen(false)}>
          AVBRYT
        </button>
      </div>
    </div>
  );
};

export default Login;
