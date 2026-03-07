import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";

const MenuIcon = ({ type }) => {
  const iconProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: "profile-menu-icon",
    "aria-hidden": "true",
  };

  if (type === "profile") {
    return (
      <svg {...iconProps}>
        <circle cx="12" cy="8" r="3.3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M5 19.2C6.8 15.8 10.1 14.2 12 14.2c1.9 0 5.2 1.6 7 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "history") {
    return (
      <svg {...iconProps}>
        <path d="M4 6.8h16M4 12h12M4 17.2h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "settings") {
    return (
      <svg {...iconProps}>
        <path d="M12 3.6v2.2M12 18.2v2.2M4.8 12H2.6M21.4 12h-2.2M18.3 5.7l-1.6 1.6M7.3 16.7l-1.6 1.6M18.3 18.3l-1.6-1.6M7.3 7.3L5.7 5.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3.1" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === "cart") {
    return (
      <svg {...iconProps}>
        <path d="M4 6h2.2l1.4 7.8h9.5l1.3-5.8H7.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="18.2" r="1.2" fill="currentColor" />
        <circle cx="16.2" cy="18.2" r="1.2" fill="currentColor" />
      </svg>
    );
  }

  if (type === "support") {
    return (
      <svg {...iconProps}>
        <path d="M12 20a8 8 0 1 0-8-8" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9.5 10.2a2.5 2.5 0 1 1 4.6 1.5c-.6 1-.8 1.2-1.6 1.8-.7.6-.8 1.1-.8 1.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="11.9" cy="18" r="0.8" fill="currentColor" />
      </svg>
    );
  }

  return null;
};

const initialsFromName = (name = "") => {
  const chunks = name.trim().split(" ").filter(Boolean);
  if (!chunks.length) return "AV";
  if (chunks.length === 1) return chunks[0].slice(0, 2).toUpperCase();
  return `${chunks[0][0] || ""}${chunks[1][0] || ""}`.toUpperCase();
};

const ProfileMenu = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const initials = useMemo(() => initialsFromName(user?.name || ""), [user?.name]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <div className="profile-menu-wrap" ref={menuRef}>
      <button
        type="button"
        className={`profile-trigger ${open ? "is-open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label="Open account menu"
      >
        <span className="avatar-dot" />
        <span className="avatar-initials">{isAuthenticated ? initials : "AV"}</span>
      </button>

      {open ? (
        <div className="profile-dropdown" role="menu">
          {isAuthenticated ? (
            <>
              <div className="profile-head">
                <div className="profile-head-avatar">{initials}</div>
                <div>
                  <h4>{user?.name || "Avi Member"}</h4>
                  <p>{user?.email || "member@aviluxe.store"}</p>
                </div>
              </div>

              <div className="profile-pills">
                <span className="profile-pill">Role: {user?.role || "user"}</span>
                <span className="profile-pill">Cart: {cartCount}</span>
              </div>

              <div className="profile-links">
                <Link to="/profile" onClick={() => setOpen(false)}>
                  <MenuIcon type="profile" />
                  <span>Profile Details</span>
                </Link>
                <Link to="/orders" onClick={() => setOpen(false)}>
                  <MenuIcon type="history" />
                  <span>Order History</span>
                </Link>
                <Link to="/settings" onClick={() => setOpen(false)}>
                  <MenuIcon type="settings" />
                  <span>Settings</span>
                </Link>
                <Link to="/cart" onClick={() => setOpen(false)}>
                  <MenuIcon type="cart" />
                  <span>Cart Overview</span>
                </Link>
                <a href="mailto:help@aviluxe.store">
                  <MenuIcon type="support" />
                  <span>Concierge Support</span>
                </a>
              </div>

              <div className="profile-feature-box">
                <h5>Premium Features</h5>
                <p>Priority dispatch, curated drops, saved cards, and personalized recommendations.</p>
              </div>

              <button type="button" className="btn btn-outline wide" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="profile-head guest">
                <div className="profile-head-avatar">AV</div>
                <div>
                  <h4>Welcome to Avi Luxe</h4>
                  <p>Login to access profile cards, history, and account controls.</p>
                </div>
              </div>

              <div className="profile-links guest-links">
                <Link to="/login" onClick={() => setOpen(false)}>
                  <MenuIcon type="profile" />
                  <span>Login</span>
                </Link>
                <Link to="/register" onClick={() => setOpen(false)}>
                  <MenuIcon type="settings" />
                  <span>Create Account</span>
                </Link>
              </div>

              <div className="profile-feature-box">
                <h5>Inside your account</h5>
                <p>Profile details, history, settings, saved addresses, and order tracking dashboard.</p>
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ProfileMenu;
