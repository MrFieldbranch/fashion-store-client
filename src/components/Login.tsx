import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  /* const [loginError, setLoginError] = useState<string | null>(null); */

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
        <input
          type="password"
          id="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="confirm-or-cancel">
        <button className="confirm-button">OK</button>
        <button className="cancel-button">AVBRYT</button>
      </div>
    </div>
  );
};

export default Login;
