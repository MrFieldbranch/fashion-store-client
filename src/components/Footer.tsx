const Footer = () => {
  return (
    <footer>
      <div className="footer-column-section">
        <div className="footer-column">
          <h3>Om Fancy Fashion</h3>
          <h3>Kontakta oss</h3>
          <h3>Karriär</h3>
        </div>
        <div className="footer-column">
          <h3>Leveranser</h3>
          <h3>Vårt nyhetsbrev</h3>
        </div>
        <div className="footer-column">
          <div className="separate-text-and-images-in-footer">
            <h3>Vi skickar med:</h3>
            <div className="footer-img-container">
              <img src="/images/postnord.png" alt="Bild på Postnord" className="footer-img-1" />
              <img src="/images/instabox.png" alt="Bild på Instabox" className="footer-img-1" />
            </div>
          </div>
        </div>
        <div className="footer-column">
          <div className="separate-text-and-images-in-footer">
            <h3>Följ oss på:</h3>
            <div className="footer-img-container">
              <img src="/images/x.png" alt="Bild på X" className="footer-img-2" />
              <img src="/images/facebook.png" alt="Bild på Facebook" className="footer-img-2" />
            </div>
          </div>
        </div>
      </div>
      <p className="footer-information">Obs! Inga riktiga länkar i footern!</p>
    </footer>
  );
};

export default Footer;
