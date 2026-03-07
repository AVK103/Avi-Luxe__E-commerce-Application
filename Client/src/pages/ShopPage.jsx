import gsap from "gsap";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import EmptyState from "../components/common/EmptyState";
import ProductCard from "../components/common/ProductCard";
import SectionHeading from "../components/common/SectionHeading";
import Spinner from "../components/common/Spinner";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useToast } from "../hooks/useToast";
import { api, readApiError } from "../services/api";

const ShopPage = () => {
  const rootRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [gender, setGender] = useState(searchParams.get("gender") || "all");
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const initialCategories = async () => {
      try {
        const { data } = await api.get("/products");
        const uniqueCategories = [...new Set((data || []).map((item) => item.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch {
        setCategories([]);
      }
    };

    initialCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (category !== "all") params.category = category;
        if (gender !== "all") params.gender = gender;

        const { data } = await api.get("/products", { params });
        setProducts(Array.isArray(data) ? data : []);

        const nextParams = new URLSearchParams();
        if (search.trim()) nextParams.set("search", search.trim());
        if (category !== "all") nextParams.set("category", category);
        if (gender !== "all") nextParams.set("gender", gender);
        setSearchParams(nextParams, { replace: true });
      } catch (err) {
        setError(readApiError(err, "Could not load products."));
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [search, category, gender, setSearchParams]);

  const productCountLabel = useMemo(
    () => `${products.length} product${products.length === 1 ? "" : "s"}`,
    [products.length]
  );

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const context = gsap.context(() => {
      gsap.from(".filters label", {
        opacity: 0,
        y: 22,
        duration: 0.52,
        stagger: 0.08,
        ease: "power3.out",
      });

      gsap.from(".premium-card", {
        opacity: 0,
        y: 28,
        scale: 0.98,
        duration: 0.55,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.1,
      });
    }, rootRef);

    return () => context.revert();
  }, [loading, products.length]);

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      showToast({
        type: "info",
        title: "Login required",
        message: "Login to use cart functionality.",
      });
      return;
    }

    const result = await addToCart(product._id, product.sizes?.[0] || "", 1);
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

    const result = await addToCart(product._id, product.sizes?.[0] || "", 1);
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
    <div className="page container premium-page" ref={rootRef}>
      <section className="section">
        <SectionHeading
          eyebrow="Shop"
          title="Discover the premium collection"
          subtitle="Filter by category, gender, and search while browsing live ratings, descriptions, and buy-ready cards."
        />

        <div className="filters">
          <label>
            Search
            <input
              type="text"
              placeholder="Search products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <label>
            Category
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">All</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            Gender
            <select value={gender} onChange={(event) => setGender(event.target.value)}>
              <option value="all">All</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
              <option value="unisex">Unisex</option>
            </select>
          </label>
        </div>
      </section>

      <section className="section">
        <div className="results-head">
          <p>{productCountLabel}</p>
        </div>

        {loading ? <Spinner label="Loading products..." /> : null}
        {!loading && error ? (
          <EmptyState
            title="Unable to load collection"
            description={error}
            action={
              <button className="btn btn-primary" onClick={() => window.location.reload()} type="button">
                Retry
              </button>
            }
          />
        ) : null}
        {!loading && !error && products.length === 0 ? (
          <EmptyState
            title="No matching products"
            description="Try changing your filters or search term."
          />
        ) : null}

        {!loading && !error && products.length > 0 ? (
          <div className="product-grid">
            {products.map((product) => (
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

export default ShopPage;
