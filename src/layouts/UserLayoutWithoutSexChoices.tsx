import { Outlet } from "react-router-dom";
import NavWithoutSexChoices from "../components/NavWithoutSexChoices";
import Footer from "../components/Footer";

const UserLayoutWithoutSexChoices = () => (
  <>
    <NavWithoutSexChoices />
    <main className="main-container">
      <Outlet />
    </main>
    <Footer />
  </>
);

export default UserLayoutWithoutSexChoices;
