
import Nav from "../components/Nav";

const StartView = () => {
  return (
    <div className="main-container">
      <Nav />
      <div className="start">
        <h1>Fashion Store</h1>
        <img
          src="https://res.cloudinary.com/dfosm8wv7/image/upload/f_auto,q_auto/v1747254871/blue_jeans_pgnfsp.png"
          alt="Tillfällig bild" className="temporary-img"
        />
      </div>
    </div>
  );
};

export default StartView;
