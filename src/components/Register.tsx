import { useState } from "react";
import type { CreateNewUserRequest } from "../models/CreateNewUserRequest";
import apiService from "../services/api-service";
import type { LoginRequest } from "../models/LoginRequest";
import type { TokenResponse } from "../models/TokenResponse";
import { jwtDecode } from "jwt-decode";

type RegisterProps = {
  setRegisterWindowOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Register = ({ setRegisterWindowOpen }: RegisterProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordAgain, setPasswordAgain] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (
    email: string,
    password: string,
    passwordAgain: string,
    firstName: string,
    lastName: string
  ) => {
    if (email.trim() === "" || password.trim() === "" || firstName.trim() === "" || lastName.trim() === "") {
      setRegisterWindowOpen(false);
      setError("Registrering misslyckad. Du måste skriva något i alla fält.");
      return;
    }

    if (password !== passwordAgain) {
      setRegisterWindowOpen(false);
      setError("Registrering misslyckad. Du har inte skrivit samma lösenord i de två fälten.");
      return;
    }

    const newUserRequest: CreateNewUserRequest = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    };

    try {
      await apiService.registerNewUserAsync(newUserRequest);
    } catch (err: any) {
      setRegisterWindowOpen(false);
      setError(err.message || "Ett oväntat fel inträffade. Registreringen misslyckades.");
      return;
    }

    try {
      const loginRequest: LoginRequest = {
        email: email,
        password: password,
      };
      const loginResponse: TokenResponse = await apiService.loginAsync(loginRequest);
      apiService.setAuthorizationHeader(loginResponse.token);
      const decodedToken: any = jwtDecode(loginResponse.token);
      localStorage.setItem("token", loginResponse.token);
      localStorage.setItem("loggedInUserFirstName", loginResponse.firstName);
      localStorage.setItem("loggedInUserId", decodedToken.nameid);
      setRegisterWindowOpen(false);      
    } catch (err: any) {
      setRegisterWindowOpen(false);
      setError(err.message || "Ett oväntat fel inträffade. Inloggningen misslyckades.");
    }    
  };

  const handleRegisterError = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setError(null);
  };

  if (error)
    return (
      <div className="pop-up">
        <p>{error}</p>
        <button onClick={handleRegisterError}>Tillbaka</button>
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
      <div className="label-and-input">
        <label htmlFor="passwordagain">Upprepa lösenord</label>
        <input
          type="password"
          id="passwordagain"
          value={passwordAgain}
          required
          onChange={(e) => setPasswordAgain(e.target.value)}
        />
      </div>
      <div className="label-and-input">
        <label htmlFor="firstname">Förnamn</label>
        <input type="text" id="firstname" value={firstName} required onChange={(e) => setFirstName(e.target.value)} />
      </div>
      <div className="label-and-input">
        <label htmlFor="lastname">Efternamn</label>
        <input type="text" id="lastname" value={lastName} required onChange={(e) => setLastName(e.target.value)} />
      </div>
      <div className="confirm-or-cancel">
        <button
          className="confirm-button"
          onClick={() => handleRegister(email, password, passwordAgain, firstName, lastName)}
        >
          OK
        </button>
        <button className="cancel-button" onClick={() => setRegisterWindowOpen(false)}>
          AVBRYT
        </button>
      </div>
    </div>
  );
};

export default Register;
