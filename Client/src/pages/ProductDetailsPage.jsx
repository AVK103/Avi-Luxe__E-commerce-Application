import gsap from "gsap";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmptyState from "../components/common/EmptyState";
import RatingStars from "../components/common/RatingStars";
import Spinner from "../components/common/Spinner";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useToast } from "../hooks/useToast";
import { api, readApiError } from "../services/api";

const ProductDetailsPage = () => {
  const rootRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setSelectedSize(data?.sizes?.[0] || "");
      } catch (err) {
        setError(readApiError(err, "Could not load product details."));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const discountedPrice = useMemo(() => {
    if (!product) return 0;
    return Number(product.price) * (1 - Number(product.discount || 0) / 100);
  }, [product]);

  useLayoutEffect(() => {
    if (!rootRef.current || !product) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .from(".product-detail-media", { opacity: 0, x: -28, duration: 0.65 })
        .from(".product-detail-body > *", { opacity: 0, y: 18, stagger: 0.08, duration: 0.45 }, "-=0.38");
    }, rootRef);

    return () => context.revert();
  }, [product]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showToast({
        type: "info",
        title: "Login required",
        message: "Please login to add products to cart.",
      });
      navigate("/login");
      return { success: false };
    }

    if (!product) return { success: false };
    const result = await addToCart(product._id, selectedSize, quantity);
    showToast({
      type: result.success ? "success" : "error",
      title: result.success ? "Added to cart" : "Cart update failed",
      message: result.message,
    });
    return result;
  };

  const handleBuyNow = async () => {
    const result = await handleAddToCart();
    if (result?.success) {
      navigate("/cart");
    }
  };

  if (loading) {
    return (
      <div className="page container">
        <Spinner label="Loading product..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page container">
        <EmptyState title="Product not found" description={error || "This item is unavailable."} />
      </div>
    );
  }

  return (
    <div className="page container premium-page" ref={rootRef}>
      <section className="product-detail">
        <div className="product-detail-media">
          <img src={product.mainImg} alt={product.title} />
        </div>

        <div className="product-detail-body">
          <p className="section-eyebrow">{product.category}</p>
          <h1>{product.title}</h1>
          <p className="product-brand">By {product.brand || "Avi Luxe"}</p>
          <RatingStars rating={product.rating} count={product.ratingsCount} />
          <p className="muted">{product.description}</p>
          <div className="price-row large">
            <strong>Rs. {Math.round(discountedPrice)}</strong>
            {product.discount ? <span>Rs. {Math.round(product.price)}</span> : null}
          </div>

          {product.sizes?.length > 0 ? (
            <label>
              Size
              <select value={selectedSize} onChange={(event) => setSelectedSize(event.target.value)}>
                {product.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label>
            Quantity
            <div className="quantity-control">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="btn btn-outline"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.min(10, value + 1))}
                className="btn btn-outline"
              >
                +
              </button>
            </div>
          </label>

          <div className="actions-row">
            <button type="button" className="btn btn-primary" onClick={handleAddToCart}>
              Add to cart
            </button>
            <button type="button" className="btn btn-primary btn-gold" onClick={handleBuyNow}>
              Buy now
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/shop")}>
              Continue shopping
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailsPage;
