import './Footer.scss';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p className="muted">
          © {new Date().getFullYear()} Jesús Enrique León Arteaga - Proyecto : Crypto Tracker · Datos de CoinGecko
        </p>
      </div>
    </footer>
  );
}

export default Footer;