import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadOrderDetails = async () => {
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        navigate("/login");
        return;
      }

      try {
        const user = JSON.parse(savedUser);

        if (!user.email) {
          setMessage("User email not found.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/my-orders/${encodeURIComponent(
            user.email
          )}/${orderId}`
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(
            data.message || "Failed to load order details."
          );
          setLoading(false);
          return;
        }

        setOrder(data.order || null);

        setItems(
          Array.isArray(data.items)
            ? data.items
            : []
        );

        setLoading(false);
      } catch (error) {
        console.error(
          "Order details error:",
          error
        );

        setMessage(
          "Failed to load order details."
        );

        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId, navigate]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-success";

      case "Shipped":
        return "bg-info text-dark";

      case "Cancelled":
        return "bg-danger";

      case "Processing":
        return "bg-warning text-dark";

      default:
        return "bg-primary";
    }
  };

  if (loading) {
    return (
      <section className="order-details-page py-5">
        <div className="container">

          <h2 className="order-details-heading fw-bold">
            Order Details
          </h2>

          <p className="text-muted mt-3">
            Loading order details...
          </p>

        </div>
      </section>
    );
  }

  if (message) {
    return (
      <section className="order-details-page py-5">
        <div className="container">

          <button
            className="btn btn-secondary mb-4 order-back-button"
            onClick={() =>
              navigate("/my-orders")
            }
          >
            ← Back to My Orders
          </button>

          <div className="alert alert-danger order-alert">
            {message}
          </div>

        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="order-details-page py-5">
        <div className="container">

          <button
            className="btn btn-secondary mb-4 order-back-button"
            onClick={() =>
              navigate("/my-orders")
            }
          >
            ← Back to My Orders
          </button>

          <div className="empty-order">
            <div className="empty-order-icon">
              📦
            </div>

            <h4 className="fw-bold">
              Order not found
            </h4>

          </div>

        </div>
      </section>
    );
  }

  return (
    <section className="order-details-page py-5">
      <div className="container">

        {/* BACK BUTTON */}

        <button
          className="btn btn-secondary mb-4 order-back-button"
          onClick={() =>
            navigate("/my-orders")
          }
        >
          ← Back to My Orders
        </button>

        {/* ORDER HEADER */}

        <div className="card order-header-card mb-4">

          <div className="card-body">

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

              <div>

                <h2 className="fw-bold mb-2 order-number">
                  Order #{order.id}
                </h2>

                <p className="text-muted mb-0">
                  {order.created_at
                    ? new Date(
                        order.created_at
                      ).toLocaleString()
                    : "N/A"}
                </p>

              </div>

              <span
                className={`badge fs-6 order-status ${getStatusClass(
                  order.status
                )}`}
              >
                {order.status || "Pending"}
              </span>

            </div>

          </div>

        </div>

        <div className="row g-4">

          {/* ORDERED PRODUCTS */}

          <div className="col-lg-8">

            <div className="card ordered-products-card">

              <div className="card-body">

                <h4 className="fw-bold mb-4 order-section-title">
                  Ordered Products
                </h4>

                {items.length === 0 ? (
                  <div className="alert alert-warning order-alert">
                    No products found for this order.
                  </div>
                ) : (
                  items.map((item) => {

                    const productName =
                      item.name ||
                      item.product_name ||
                      "Product";

                    const quantity =
                      Number(item.quantity) || 1;

                    const price =
                      Number(item.price) || 0;

                    const subtotal =
                      price * quantity;

                    return (
                      <div
                        key={item.id}
                        className="order-product-row d-flex align-items-center"
                      >

                        {/* PRODUCT IMAGE */}

                        {item.image ? (
                          <img
                            src={item.image}
                            alt={productName}
                            className="order-product-image"
                          />
                        ) : (
                          <div className="order-product-placeholder">
                            🛍️
                          </div>
                        )}

                        {/* PRODUCT INFO */}

                        <div className="flex-grow-1 order-product-info">

                          <h5 className="fw-bold mb-1">
                            {productName}
                          </h5>

                          <p className="text-muted mb-1">
                            Quantity: {quantity}
                          </p>

                          <p className="text-primary fw-bold mb-0">
                            Rs.{" "}
                            {price.toFixed(2)}
                          </p>

                        </div>

                        {/* SUBTOTAL */}

                        <div className="text-end order-subtotal">

                          <small className="text-muted">
                            Subtotal
                          </small>

                          <div className="fw-bold">
                            Rs.{" "}
                            {subtotal.toFixed(2)}
                          </div>

                        </div>

                      </div>
                    );
                  })
                )}

              </div>

            </div>

          </div>

          {/* ORDER INFORMATION */}

          <div className="col-lg-4">

            <div className="card order-info-card">

              <div className="card-body">

                <h4 className="fw-bold mb-4 order-section-title">
                  Order Information
                </h4>

                <div className="order-info-item">

                  <small>
                    Customer Name
                  </small>

                  <div className="fw-bold">
                    {order.customer_name}
                  </div>

                </div>

                <div className="order-info-item">

                  <small>
                    Email
                  </small>

                  <div>
                    {order.customer_email}
                  </div>

                </div>

                <div className="order-info-item">

                  <small>
                    Payment Method
                  </small>

                  <div className="mt-1">

                    {order.payment_method ===
                    "JazzCash" ? (
                      <span className="badge bg-info text-dark">
                        📱 JazzCash
                      </span>
                    ) : (
                      <span className="badge bg-secondary">
                        💵 Cash on Delivery
                      </span>
                    )}

                  </div>

                </div>

                <div className="order-info-item">

                  <small>
                    Delivery Address
                  </small>

                  <div>
                    {order.customer_address ||
                      "N/A"}
                  </div>

                </div>

                <hr />

                <div className="d-flex justify-content-between align-items-center">

                  <span className="fw-bold">
                    Total
                  </span>

                  <span className="text-primary fw-bold fs-5">
                    Rs.{" "}
                    {Number(order.total).toFixed(2)}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default OrderDetails;