import { useState } from "react";
import type { LoginRequest } from "../models/LoginRequest";
import type { TokenResponse } from "../models/TokenResponse";
import apiService from "../services/api-service";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

type LoginProps = {
  setLoginWindowOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

const Login = ({ setLoginWindowOpen, setError }: LoginProps) => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");  

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
      const userFirstName = loginResponse.firstName;
      const userLastName = loginResponse.lastName;
      const role = decodedToken.role; /* Skippar || "User" eftersom det finns väl i role? */
      login(userId, userFirstName, userLastName, loginResponse.token, role);
      showToast(`Välkommen ${userFirstName}!`);
      if (role === "Admin") navigate("/admin/dashboard");
      else setLoginWindowOpen(false);
    } catch (err: any) {
      setLoginWindowOpen(false);
      setError(err.message || "Ett oväntat fel inträffade. Inloggningen misslyckades.");
    }
  };

  return (
    <div className="non-clickable-background" onClick={(e) => e.stopPropagation()}>
      <div className="pop-up">
        <div className="label-and-input-for-login-register">
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
        <div className="label-and-input-for-login-register">
          <label htmlFor="password">Lösenord</label>
          <input
            type="password"
            id="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="confirm-or-cancel">
          <button className="button-green" onClick={() => handleLogin(email, password)}>
            OK
          </button>
          <button className="button-red" onClick={() => setLoginWindowOpen(false)}>
            AVBRYT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
