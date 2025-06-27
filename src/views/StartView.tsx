import Nav from "../components/Nav";

const StartView = () => {
  return (
    <div className="main-container">
      <Nav />
      <div className="start">
        <div className="hero-section">
          <div className="hero-image-1"></div>
          <div className="hero-text">
            <h2>
              Tidlös stil möter
              <br />
              djärvt självförtroende
            </h2>
          </div>
          <div className="hero-text">
            <h2>
              Berätta vem du är
              <br />
              genom vad du har på dig
            </h2>
          </div>
          <div className="hero-image-2"></div>
        </div>
      </div>
    </div>
  );
};

export default StartView;
