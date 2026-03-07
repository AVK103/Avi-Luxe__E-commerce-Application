import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import ProfileMenu from "./ProfileMenu";

const NavIcon = ({ type }) => {
  const iconProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: "nav-icon",
    "aria-hidden": "true",
  };

  if (type === "home") {
    return (
      <svg {...iconProps}>
        <path d="M3 11.8L12 4l9 7.8V20a1 1 0 0 1-1 1h-5.6v-5.2H9.6V21H4a1 1 0 0 1-1-1v-8.2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "shop") {
    return (
      <svg {...iconProps}>
        <path d="M4 9h16l-1.1 10.2a1 1 0 0 1-1 .8H6.1a1 1 0 0 1-1-.8L4 9Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8.5 9V7.4a3.5 3.5 0 0 1 7 0V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "orders") {
    return (
      <svg {...iconProps}>
        <rect x="4" y="4" width="16" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "cart") {
    return (
      <svg {...iconProps}>
        <path d="M4 6h2.2l1.5 8h9.3l1.4-6H7.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="18.2" r="1.3" fill="currentColor" />
        <circle cx="16.5" cy="18.2" r="1.3" fill="currentColor" />
      </svg>
    );
  }

  if (type === "login") {
    return (
      <svg {...iconProps}>
        <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10 16l4-4-4-4M14 12H4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "join") {
    return (
      <svg {...iconProps}>
        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return null;
};

const Navbar = () => {
  const { cartCount } = useCart();
  const [open, setOpen] = useState(false);
  const logoSrc = `${import.meta.env.BASE_URL}avi-luxe-mark.svg`;

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <img src={logoSrc} alt="Avi Luxe logo" className="brand-logo-img" />
          </span>
          <span className="brand-copy">
            <strong>Avi Luxe</strong>
            <small>Premium Commerce</small>
          </span>
        </Link>

        <button className="menu-toggle" onClick={() => setOpen((value) => !value)} type="button">
          Menu
        </button>

        <div className="nav-right-zone">
          <nav className={`nav-links ${open ? "is-open" : ""}`}>
            <NavLink to="/" onClick={() => setOpen(false)}>
              <NavIcon type="home" />
              <span className="nav-label">Home</span>
            </NavLink>
            <NavLink to="/shop" onClick={() => setOpen(false)}>
              <NavIcon type="shop" />
              <span className="nav-label">Shop</span>
            </NavLink>
            <NavLink to="/orders" onClick={() => setOpen(false)}>
              <NavIcon type="orders" />
              <span className="nav-label">Orders</span>
            </NavLink>
            <NavLink to="/cart" className="cart-link" onClick={() => setOpen(false)}>
              <NavIcon type="cart" />
              <span className="nav-label">Cart</span>
              <span className="cart-count">{cartCount}</span>
            </NavLink>
          </nav>

          <div className="nav-right">
            <ProfileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
