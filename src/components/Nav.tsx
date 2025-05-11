import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const Nav = () => {
  const [loginWindowOpen, setLoginWindowOpen] = useState<boolean>(false);
  const [registerWindowOpen, setRegisterWindowOpen] = useState<boolean>(false);

  return (
    <nav>
      <h2>Fashion Store</h2>
      <button onClick={() => setLoginWindowOpen(true)}>Logga in</button>
      <button onClick={() => setRegisterWindowOpen(true)}>Skapa ett konto</button>
      {loginWindowOpen && <Login setLoginWindowOpen={setLoginWindowOpen} />}
      {registerWindowOpen && <Register setRegisterWindowOpen={setRegisterWindowOpen} />}
    </nav>
  );
};

export default Nav;
