import { Link } from "react-router-dom";
import SectionHeading from "../components/common/SectionHeading";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

const SidebarIcon = ({ type }) => {
  const iconProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: "profile-side-svg",
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

  if (type === "orders") {
    return (
      <svg {...iconProps}>
        <rect x="4" y="4" width="16" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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

  return null;
};

const ProfilePage = () => {
  const { user } = useAuth();
  const { cartCount } = useCart();

  return (
    <div className="page container premium-page">
      <section className="section">
        <SectionHeading
          eyebrow="Profile"
          title="Your Account Overview"
          subtitle="Manage your details, track history, and access premium member controls."
        />
      </section>

      <section className="profile-layout">
        <article className="profile-main-card">
          <div className="profile-main-head">
            <div className="profile-main-avatar">
              {(user?.name || "A")
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((item) => item[0])
                .join("")
                .toUpperCase()}
            </div>
            <div>
              <h2>{user?.name || "Avi Member"}</h2>
              <p>{user?.email || "member@aviluxe.store"}</p>
              <span className="profile-chip">Role: {user?.role || "user"}</span>
            </div>
          </div>

          <div className="profile-info-grid">
            <div>
              <p className="muted">Mobile</p>
              <strong>{user?.mobile || "Not added"}</strong>
            </div>
            <div>
              <p className="muted">Address</p>
              <strong>{user?.address?.line1 || "Not added"}</strong>
            </div>
            <div>
              <p className="muted">Pincode</p>
              <strong>{user?.address?.pincode || "Not added"}</strong>
            </div>
            <div>
              <p className="muted">Active Cart Items</p>
              <strong>{cartCount}</strong>
            </div>
          </div>
        </article>

        <aside className="profile-side-card">
          <div className="profile-side-head">
            <span className="profile-side-icon" aria-hidden="true">
              <SidebarIcon type="profile" />
            </span>
            <div>
              <h3>Profile Sidebar</h3>
              <p className="muted">Quick account controls</p>
            </div>
          </div>
          <div className="profile-action-list">
            <Link to="/orders" className="profile-action-item">
              <span className="profile-action-icon">
                <SidebarIcon type="orders" />
              </span>
              <span>View order history</span>
            </Link>
            <Link to="/settings" className="profile-action-item">
              <span className="profile-action-icon">
                <SidebarIcon type="settings" />
              </span>
              <span>Open account settings</span>
            </Link>
            <Link to="/cart" className="profile-action-item">
              <span className="profile-action-icon">
                <SidebarIcon type="cart" />
              </span>
              <span>Review cart and checkout</span>
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default ProfilePage;
