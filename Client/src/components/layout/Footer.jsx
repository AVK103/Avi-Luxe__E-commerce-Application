import { Link } from "react-router-dom";
import FooterPrismScene from "../three/FooterPrismScene";

const logoSrc = `${import.meta.env.BASE_URL}avi-luxe-mark.svg`;

const Footer = () => (
  <footer className="site-footer mega-footer">
    <section className="container footer-showcase">
      <div className="footer-scene-shell">
        <FooterPrismScene />
        <div className="footer-scene-overlay">
          <p className="footer-eyebrow">Avi Luxe Signature</p>
          <h2>Crafted to feel like a luxury flagship, not a generic storefront.</h2>
          <p>
            Cinematic motion, rich gradients, premium cards, and smooth transitions built for an elevated
            shopping experience.
          </p>
          <div className="footer-cta-row">
            <Link to="/shop" className="btn btn-primary">
              Explore Collection
            </Link>
            <Link to="/register" className="btn btn-outline">
              Join Member Club
            </Link>
          </div>
        </div>
      </div>
    </section>

    <section className="container footer-grid premium-footer-grid">
      <div className="footer-brand-block">
        <div className="footer-logo-line">
          <img src={logoSrc} alt="Avi Luxe" />
          <div>
            <h3>Avi Luxe</h3>
            <p>Premium Commerce</p>
          </div>
        </div>
        <p>
          We build premium retail experiences that blend fashion, technology, and design-led storytelling.
        </p>
      </div>

      <div>
        <h4>Discover</h4>
        <ul className="footer-links">
          <li>
            <Link to="/shop?category=Outerwear">Outerwear</Link>
          </li>
          <li>
            <Link to="/shop?category=Footwear">Footwear</Link>
          </li>
          <li>
            <Link to="/shop?category=Accessories">Accessories</Link>
          </li>
          <li>
            <Link to="/shop?category=Bags">Bags</Link>
          </li>
        </ul>
      </div>

      <div>
        <h4>Services</h4>
        <ul className="footer-links">
          <li>Priority Shipping</li>
          <li>Secure Checkout</li>
          <li>Gift Packaging</li>
          <li>24x7 Concierge</li>
        </ul>
      </div>

      <div>
        <h4>Contact</h4>
        <ul className="footer-links">
          <li>help@aviluxe.store</li>
          <li>+91 90000 12345</li>
          <li>Mon-Sat, 9AM - 7PM</li>
          <li>Mumbai, India</li>
        </ul>
      </div>
    </section>

    <div className="container footer-bottom">
      <p>(c) {new Date().getFullYear()} Avi Luxe. Crafted for premium digital retail.</p>
      <div className="footer-bottom-links">
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Returns</a>
      </div>
    </div>
  </footer>
);

export default Footer;
