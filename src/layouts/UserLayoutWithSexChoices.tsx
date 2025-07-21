import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const UserLayoutWithSexChoices = () => (
  <>
    <Nav />
    <main className="main-container">
      <Outlet />
    </main>
    <Footer />
  </>
);

export default UserLayoutWithSexChoices;
