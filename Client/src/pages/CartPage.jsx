import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmptyState from "../components/common/EmptyState";
import Spinner from "../components/common/Spinner";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useToast } from "../hooks/useToast";
import { api, readApiError } from "../services/api";

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, cartLoading, updateCartItem, removeCartItem, clearCart } = useCart();
  const { showToast } = useToast();

  const [shipping, setShipping] = useState({
    name: user?.name || "",
    mobile: user?.mobile || "",
    address: user?.address?.line1 || "",
    pincode: user?.address?.pincode || "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const totals = useMemo(() => {
    const items = cart.items || [];
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
    const discount = items.reduce(
      (sum, item) =>
        sum +
        ((Number(item.price || 0) * Number(item.discount || 0)) / 100) * Number(item.quantity || 0),
      0
    );
    return {
      subtotal,
      discount,
      total: Math.max(subtotal - discount, 0),
    };
  }, [cart.items]);

  const handleQuantityChange = async (itemId, quantity) => {
    const result = await updateCartItem(itemId, { quantity });
    if (!result.success) {
      setError(result.message);
    }
  };

  const handleRemove = async (itemId) => {
    const result = await removeCartItem(itemId);
    if (!result.success) {
      setError(result.message);
    }
  };

  const placeOrder = async () => {
    setError("");
    setSuccess("");

    if (!shipping.name || !shipping.mobile || !shipping.address || !shipping.pincode) {
      const message = "All shipping details are required.";
      setError(message);
      showToast({ type: "error", title: "Order failed", message });
      return;
    }

    if (!cart.items?.length) {
      const message = "Your cart is empty.";
      setError(message);
      showToast({ type: "error", title: "Order failed", message });
      return;
    }

    setOrderLoading(true);
    try {
      const orderPayload = {
        items: cart.items.map((item) => ({
          product: item.product?._id || item.product,
          title: item.title,
          description: item.description,
          mainImg: item.mainImg,
          size: item.size,
          quantity: Number(item.quantity),
          price: Number(item.price),
          discount: Number(item.discount || 0),
        })),
        shippingAddress: shipping,
        paymentMethod,
      };

      await api.post("/orders", orderPayload);
      await clearCart();
      const message = "Order placed successfully.";
      setSuccess(message);
      showToast({ type: "success", title: "Order confirmed", message });
      navigate("/orders");
    } catch (err) {
      const message = readApiError(err, "Failed to place order.");
      setError(message);
      showToast({ type: "error", title: "Order failed", message });
    } finally {
      setOrderLoading(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="page container">
        <Spinner label="Loading your cart..." />
      </div>
    );
  }

  return (
    <div className="page container">
      <section className="section">
        <h1>Your Cart</h1>
        <p className="muted">Review items and confirm your delivery details.</p>
      </section>

      {!cart.items?.length ? (
        <EmptyState
          title="Cart is empty"
          description="Add products from the collection to continue."
          action={
            <Link to="/shop" className="btn btn-primary">
              Continue shopping
            </Link>
          }
        />
      ) : (
        <section className="cart-layout">
          <div className="cart-items">
            {cart.items.map((item) => (
              <article key={item._id} className="cart-item">
                <img src={item.mainImg} alt={item.title} />
                <div>
                  <h3>{item.title}</h3>
                  <p className="muted">{item.size ? `Size: ${item.size}` : "Standard size"}</p>
                  <p className="price">Rs. {Math.round(item.price)}</p>
                </div>
                <div className="cart-actions">
                  <select
                    value={item.quantity}
                    onChange={(event) => handleQuantityChange(item._id, Number(event.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((qty) => (
                      <option key={qty} value={qty}>
                        Qty {qty}
                      </option>
                    ))}
                  </select>
                  <button className="btn btn-outline" onClick={() => handleRemove(item._id)} type="button">
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <h3>Checkout</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>Rs. {Math.round(totals.subtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>Discount</span>
              <strong>- Rs. {Math.round(totals.discount)}</strong>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <strong>Rs. {Math.round(totals.total)}</strong>
            </div>

            <div className="form-grid">
              <label>
                Full name
                <input
                  value={shipping.name}
                  onChange={(event) => setShipping((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Recipient name"
                />
              </label>
              <label>
                Mobile
                <input
                  value={shipping.mobile}
                  onChange={(event) => setShipping((prev) => ({ ...prev, mobile: event.target.value }))}
                  placeholder="Phone number"
                />
              </label>
              <label>
                Address
                <input
                  value={shipping.address}
                  onChange={(event) => setShipping((prev) => ({ ...prev, address: event.target.value }))}
                  placeholder="Street, city"
                />
              </label>
              <label>
                Pincode
                <input
                  value={shipping.pincode}
                  onChange={(event) => setShipping((prev) => ({ ...prev, pincode: event.target.value }))}
                  placeholder="Postal code"
                />
              </label>
              <label>
                Payment
                <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                  <option value="cod">Cash on Delivery</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="netbanking">Net Banking</option>
                </select>
              </label>
            </div>
            <button className="btn btn-primary wide" onClick={placeOrder} disabled={orderLoading} type="button">
              {orderLoading ? "Placing order..." : "Place order"}
            </button>
            {error ? <p className="banner danger">{error}</p> : null}
            {success ? <p className="banner success">{success}</p> : null}
          </aside>
        </section>
      )}
    </div>
  );
};

export default CartPage;
