import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  // CHECK ADMIN LOGIN
  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (token !== "admin-token") {
      navigate("/admin-login", { replace: true });
    }
  }, [navigate]);

  // GET PRODUCTS
  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (token !== "admin-token") {
      return;
    }

    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // GET ORDERS
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("adminToken");

      if (token !== "admin-token") {
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // UPDATE ORDER STATUS
  const handleStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update order status");
    }
  };

  // ADD PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(
        "http://localhost:5000/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            price,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Product added successfully!");

      setName("");
      setPrice("");

      setProducts((currentProducts) => [
        ...currentProducts,
        data,
      ]);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  // DELETE PRODUCT
  const handleDelete = async (id) => {
    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Product deleted successfully!");

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product.id !== id
        )
      );
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  // UPDATE PRODUCT
  const handleUpdate = async (id) => {
    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editName,
            price: editPrice,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Product updated successfully!");

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === id ? data.product : product
        )
      );

      setEditingId(null);
      setEditName("");
      setEditPrice("");
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login", { replace: true });
  };

  return (
    <section className="admin-page py-5">
      <div className="container">

        {/* HEADER */}

        <div className="admin-header">

          <div>
            <h2 className="admin-title">
              Admin Dashboard
            </h2>

            <p className="admin-subtitle">
              Manage products and customer orders
            </p>
          </div>

          <button
            className="btn btn-danger admin-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

        {/* ADD PRODUCT */}

        <div className="admin-add-card card">

          <div className="card-body">

            <h4 className="admin-section-title">
              Add Product
            </h4>

            <form onSubmit={handleSubmit}>

              <div className="row g-3">

                <div className="col-md-5">

                  <label className="form-label">
                    Product Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter product name"
                    required
                  />

                </div>

                <div className="col-md-4">

                  <label className="form-label">
                    Price
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
                    placeholder="Enter price"
                    required
                  />

                </div>

                <div className="col-md-3 d-flex align-items-end">

                  <button
                    type="submit"
                    className="btn btn-primary admin-add-button w-100"
                  >
                    + Add Product
                  </button>

                </div>

              </div>

            </form>

          </div>

        </div>

        {/* ALL PRODUCTS */}

        <div className="admin-section">

          <h4 className="admin-section-title">
            All Products
          </h4>

          <div className="row g-4">

            {products.map((product) => (

              <div
                className="col-md-6"
                key={product.id}
              >

                <div className="admin-product-card">

                  {editingId === product.id ? (

                    <div>

                      <h5 className="fw-bold mb-3">
                        Edit Product
                      </h5>

                      <input
                        type="text"
                        className="form-control mb-2"
                        value={editName}
                        onChange={(e) =>
                          setEditName(e.target.value)
                        }
                        placeholder="Product name"
                      />

                      <input
                        type="number"
                        className="form-control mb-3"
                        value={editPrice}
                        onChange={(e) =>
                          setEditPrice(e.target.value)
                        }
                        placeholder="Price"
                      />

                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() =>
                          handleUpdate(product.id)
                        }
                      >
                        Update
                      </button>

                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setEditingId(null);
                          setEditName("");
                          setEditPrice("");
                        }}
                      >
                        Cancel
                      </button>

                    </div>

                  ) : (

                    <div className="d-flex justify-content-between align-items-center gap-3">

                      <div>

                        <span className="product-number">
                          Product #{product.id}
                        </span>

                        <h5 className="fw-bold mb-1">
                          {product.name}
                        </h5>

                        <p className="product-price mb-0">
                          Rs. {product.price}
                        </p>

                      </div>

                      <div className="admin-product-actions">

                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => {
                            setEditingId(product.id);
                            setEditName(product.name);
                            setEditPrice(product.price);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleDelete(product.id)
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  )}

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* CUSTOMER ORDERS */}

        <div className="admin-section">

          <h4 className="admin-section-title">
            Customer Orders
          </h4>

          {orders.length === 0 ? (

            <div className="alert alert-info admin-alert">
              No orders found.
            </div>

          ) : (

            <div className="admin-orders-card">

              <div className="table-responsive">

                <table className="table admin-orders-table align-middle">

                  <thead>

                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                    </tr>

                  </thead>

                  <tbody>

                    {orders.map((order) => (

                      <tr key={order.id}>

                        <td className="fw-bold">
                          #{order.id}
                        </td>

                        <td>
                          {order.customer_name}
                        </td>

                        <td>
                          {order.customer_email}
                        </td>

                        <td className="order-address">
                          {order.customer_address}
                        </td>

                        <td className="admin-order-total">
                          Rs.{" "}
                          {Number(order.total).toFixed(2)}
                        </td>

                        <td>

                          {order.payment_method === "JazzCash" ? (

                            <span className="badge bg-info text-dark">
                              📱 JazzCash
                            </span>

                          ) : (

                            <span className="badge bg-secondary">
                              💵 Cash on Delivery
                            </span>

                          )}

                        </td>

                        <td>

                          <select
                            className="form-select form-select-sm status-select"
                            value={
                              order.status || "Pending"
                            }
                            onChange={(e) =>
                              handleStatusChange(
                                order.id,
                                e.target.value
                              )
                            }
                          >

                            <option value="Pending">
                              Pending
                            </option>

                            <option value="Processing">
                              Processing
                            </option>

                            <option value="Shipped">
                              Shipped
                            </option>

                            <option value="Delivered">
                              Delivered
                            </option>

                          </select>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </div>

      </div>
    </section>
  );
}

export default Admin;