import gsap from "gsap";
import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmptyState from "../components/common/EmptyState";
import ProductCard from "../components/common/ProductCard";
import SectionHeading from "../components/common/SectionHeading";
import Spinner from "../components/common/Spinner";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useToast } from "../hooks/useToast";
import { api, readApiError } from "../services/api";

const LuxuryScene = lazy(() => import("../components/three/LuxuryScene"));

const HomePage = () => {
  const rootRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/products");
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(readApiError(err, "Could not load products."));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category).filter(Boolean))].slice(0, 6),
    [products]
  );

  const featuredProducts = products.slice(0, 8);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .from(".hero-badge", { opacity: 0, y: 24, duration: 0.45 })
        .from(".hero-copy h1", { opacity: 0, y: 34, duration: 0.65 }, "-=0.2")
        .from(".hero-copy p", { opacity: 0, y: 22, duration: 0.5 }, "-=0.35")
        .from(".hero-actions .btn", { opacity: 0, y: 20, duration: 0.45, stagger: 0.1 }, "-=0.25")
        .from(".hero-panel-shell", { opacity: 0, scale: 0.96, duration: 0.65 }, "-=0.55")
        .from(".hero-metric", { opacity: 0, y: 18, duration: 0.5, stagger: 0.1 }, "-=0.32")
        .from(".chip", { opacity: 0, y: 14, duration: 0.42, stagger: 0.06 }, "-=0.25");

      gsap.from(".premium-card", {
        opacity: 0,
        y: 32,
        duration: 0.65,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.2,
      });
    }, rootRef);

    return () => context.revert();
  }, [loading, featuredProducts.length]);

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      showToast({
        type: "info",
        title: "Login required",
        message: "Please login to add items to cart.",
      });
      navigate("/login");
      return;
    }

    const defaultSize = product.sizes?.[0] || "";
    const result = await addToCart(product._id, defaultSize, 1);
    showToast({
      type: result.success ? "success" : "error",
      title: result.success ? "Added to cart" : "Cart update failed",
      message: result.message,
    });
  };

  const handleBuyNow = async (product) => {
    if (!isAuthenticated) {
      showToast({
        type: "info",
        title: "Login required",
        message: "Please login to buy this product.",
      });
      navigate("/login");
      return;
    }

    const defaultSize = product.sizes?.[0] || "";
    const result = await addToCart(product._id, defaultSize, 1);
    showToast({
      type: result.success ? "success" : "error",
      title: result.success ? "Added to cart" : "Cart update failed",
      message: result.message,
    });

    if (result.success) {
      navigate("/cart");
    }
  };

  return (
    <div className="page premium-page" ref={rootRef}>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="hero-badge">Spring Edit 2026</p>
            <h1>Luxury commerce crafted with motion, depth, and precision.</h1>
            <p>
              Explore premium apparel and accessories with curated craftsmanship, high quality materials,
              and an elevated shopping journey.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary">
                Explore collection
              </Link>
              <Link to="/register" className="btn btn-outline">
                Become a member
              </Link>
            </div>
          </div>

          <div className="hero-panel-shell">
            <Suspense fallback={<div className="hero-scene-fallback" />}>
              <LuxuryScene />
            </Suspense>
            <div className="hero-panel-content">
              <p>Trusted by 12k+ shoppers</p>
              <h3>Animated premium storefront built for modern luxury retail.</h3>
              <div className="stats-grid">
                <div className="hero-metric">
                  <strong>48h</strong>
                  <span>Dispatch window</span>
                </div>
                <div className="hero-metric">
                  <strong>4.9/5</strong>
                  <span>Member rating</span>
                </div>
                <div className="hero-metric">
                  <strong>300+</strong>
                  <span>Curated products</span>
                </div>
              </div>
              <p className="hero-note">Immersive visuals powered by Three.js and GSAP transitions.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <SectionHeading
          eyebrow="Signature Lanes"
          title="Curated categories for premium lifestyle"
          subtitle="Every category is handpicked for quality materials, timeless silhouettes, and standout detail."
        />
        <div className="chip-row">
          {categories.length > 0
            ? categories.map((category) => (
                <Link key={category} to={`/shop?category=${encodeURIComponent(category)}`} className="chip">
                  {category}
                </Link>
              ))
            : ["Outerwear", "Footwear", "Accessories", "Bags"].map((category) => (
                <span key={category} className="chip muted">
                  {category}
                </span>
              ))}
        </div>
      </section>

      <section className="section container">
        <SectionHeading
          eyebrow="Bestsellers"
          title="Premium cards with ratings and rich detail"
          subtitle="Browse top-performing products with live pricing, user ratings, and instant checkout actions."
        />
        {loading ? <Spinner label="Loading premium collection..." /> : null}
        {!loading && error ? (
          <EmptyState
            title="Could not load products"
            description={error}
            action={
              <Link className="btn btn-primary" to="/shop">
                Open shop
              </Link>
            }
          />
        ) : null}
        {!loading && !error ? (
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <div className="premium-card" key={product._id}>
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default HomePage;
