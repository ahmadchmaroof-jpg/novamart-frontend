import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      setMessage("Please login to view your orders.");
      setLoading(false);
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
        `https://ecommerence-backend-omega.vercel.app/api/my-orders/${encodeURIComponent(
          user.email
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load your orders.");
      setLoading(false);
    }
  };

  const deleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete Order #${orderId}?`
    );

    if (!confirmDelete) {
      return;
    }

    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      alert("Please login first.");
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      setDeletingId(orderId);

      const response = await fetch(
        `https://ecommerence-backend-omega.vercel.app/api/my-orders/${encodeURIComponent(
          user.email
        )}/${orderId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete order"
        );
      }

      setOrders((currentOrders) =>
        currentOrders.filter(
          (order) => order.id !== orderId
        )
      );

      alert("Order deleted successfully.");
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to delete order.");
    } finally {
      setDeletingId(null);
    }
  };

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
      <section className="my-orders-page py-5">
        <div className="container">
          <h2 className="orders-heading fw-bold">
            My Orders
          </h2>

          <p className="text-muted mt-3">
            Loading your orders...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="my-orders-page py-5">
      <div className="container">

        <div className="orders-header">
          <h2 className="orders-heading fw-bold mb-2">
            My Orders
          </h2>

          <p className="orders-subtitle">
            Track and manage your orders
          </p>
        </div>

        {message && (
          <div className="alert alert-danger orders-alert">
            {message}
          </div>
        )}

        {!message && orders.length === 0 && (
          <div className="empty-orders">
            <div className="empty-orders-icon">
              🛍️
            </div>

            <h4 className="fw-bold">
              No Orders Yet
            </h4>

            <p className="text-muted">
              You have not placed any orders yet.
            </p>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/")}
            >
              Start Shopping
            </button>
          </div>
        )}

        {orders.length > 0 && (
          <div className="orders-table-card">

            <div className="table-responsive">

              <table className="table orders-table align-middle">

                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {orders.map((order) => (
                    <tr key={order.id}>

                      <td className="fw-bold order-id">
                        #{order.id}
                      </td>

                      <td className="order-date">
                        {order.created_at
                          ? new Date(
                              order.created_at
                            ).toLocaleString()
                          : "N/A"}
                      </td>

                      <td className="order-total">
                        Rs.{" "}
                        {Number(order.total).toFixed(2)}
                      </td>

                      <td>
                        <span
                          className={`badge order-status ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status || "Pending"}
                        </span>
                      </td>

                      <td>
                        <div className="order-actions">

                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                              navigate(
                                `/my-orders/${order.id}`
                              )
                            }
                          >
                            View Details
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            disabled={
                              deletingId === order.id
                            }
                            onClick={() =>
                              deleteOrder(order.id)
                            }
                          >
                            {deletingId === order.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}

export default MyOrders;
