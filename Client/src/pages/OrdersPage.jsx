import { useEffect, useState } from "react";
import EmptyState from "../components/common/EmptyState";
import Spinner from "../components/common/Spinner";
import { api, readApiError } from "../services/api";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/orders/my");
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(readApiError(err, "Could not fetch orders."));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="page container">
        <Spinner label="Loading your orders..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page container">
        <EmptyState title="Could not load orders" description={error} />
      </div>
    );
  }

  return (
    <div className="page container">
      <section className="section">
        <h1>My Orders</h1>
        <p className="muted">Track your recent purchases and delivery progress.</p>
      </section>

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Your placed orders will appear here once checkout is completed."
        />
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <article key={order._id} className="order-card">
              <div className="order-top">
                <div>
                  <p className="muted">Order ID</p>
                  <strong>{order._id}</strong>
                </div>
                <span className={`status status-${order.status}`}>{order.status}</span>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={`${order._id}-${index}`} className="order-item">
                    <img src={item.mainImg} alt={item.title} />
                    <div>
                      <h4>{item.title}</h4>
                      <p className="muted">
                        Qty {item.quantity} {item.size ? `| Size ${item.size}` : ""}
                      </p>
                    </div>
                    <strong>Rs. {Math.round(item.price)}</strong>
                  </div>
                ))}
              </div>

              <div className="order-meta">
                <p>
                  Ordered: <strong>{new Date(order.orderDate || order.createdAt).toLocaleDateString()}</strong>
                </p>
                <p>
                  Total: <strong>Rs. {Math.round(order.prices?.total || 0)}</strong>
                </p>
                <p>
                  Payment: <strong>{order.paymentMethod}</strong>
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
