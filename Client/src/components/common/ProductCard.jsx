import gsap from "gsap";
import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import RatingStars from "./RatingStars";

const ProductCard = ({ product, onAddToCart, onBuyNow }) => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const discountedPrice = Number(product.price) * (1 - Number(product.discount || 0) / 100);
  const stockStatus = useMemo(() => {
    if (Number(product.stock || 0) === 0) {
      return "Sold Out";
    }

    if (Number(product.stock || 0) < 20) {
      return "Limited";
    }

    return "In Stock";
  }, [product.stock]);

  const handlePointerMove = (event) => {
    const node = cardRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width;
    const relativeY = (event.clientY - rect.top) / rect.height;
    const rotateY = (relativeX - 0.5) * 12;
    const rotateX = (0.5 - relativeY) * 10;

    gsap.to(node, {
      rotateX,
      rotateY,
      z: 10,
      transformPerspective: 900,
      duration: 0.45,
      ease: "power3.out",
    });

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        xPercent: (relativeX - 0.5) * 20,
        yPercent: (relativeY - 0.5) * 20,
        opacity: 1,
        duration: 0.35,
      });
    }
  };

  const resetPointer = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotateX: 0,
        rotateY: 0,
        z: 0,
        duration: 0.55,
        ease: "expo.out",
      });
    }

    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 0.32, xPercent: 0, yPercent: 0, duration: 0.4 });
    }
  };

  return (
    <article
      className="product-card"
      ref={cardRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={resetPointer}
      onFocus={resetPointer}
    >
      <span className="card-glow" ref={glowRef} />
      <Link to={`/products/${product._id}`} className="product-media">
        <img src={product.mainImg} alt={product.title} loading="lazy" />
        <span className="product-stock">{stockStatus}</span>
      </Link>

      <div className="product-body">
        <div className="product-head">
          <p className="pill">{product.brand || "Avi Luxe"}</p>
          {product.discount ? <p className="discount">{product.discount}% off</p> : null}
        </div>
        <h3>
          <Link to={`/products/${product._id}`}>{product.title}</Link>
        </h3>
        <p className="product-category">{product.category}</p>
        <RatingStars rating={product.rating} count={product.ratingsCount} />
        <p className="muted copy-clamp">{product.description}</p>
        <div className="price-row">
          <strong>Rs. {Math.round(discountedPrice)}</strong>
          {product.discount ? <span>Rs. {Math.round(product.price)}</span> : null}
        </div>
      </div>

      <div className="product-actions">
        {onAddToCart ? (
          <button
            type="button"
            className="btn btn-outline wide"
            onClick={(event) => {
              event.preventDefault();
              onAddToCart(product);
            }}
          >
            Add to Cart
          </button>
        ) : null}
        {onBuyNow ? (
          <button
            type="button"
            className="btn btn-primary wide"
            onClick={(event) => {
              event.preventDefault();
              onBuyNow(product);
            }}
          >
            Buy Now
          </button>
        ) : null}
      </div>
    </article>
  );
};

export default ProductCard;
