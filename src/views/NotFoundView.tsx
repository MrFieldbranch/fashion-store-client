import { Link } from "react-router-dom";

const NotFoundView = () => {
  return (
    <div className="main-container">
      <div className="not-found">
        <h1>Oops, sidan kunde inte hittas</h1>
        <Link to="/start">Tillbaka till Startsidan</Link>
      </div>
    </div>
  );
};

export default NotFoundView;
