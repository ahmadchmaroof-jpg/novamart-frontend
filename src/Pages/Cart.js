import { useEffect, useState } from "react";

function Cart({ cart, removeFromCart, setCart }) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(
    "Cash on Delivery"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);

        setCustomerName(user.name || "");
        setCustomerEmail(user.email || "");
      } catch (error) {
        console.error("Invalid user data:", error);
      }
    }
  }, []);

  const increaseQuantity = (index) => {
    setCart((currentCart) =>
      currentCart.map((product, i) =>
        i === index
          ? {
              ...product,
              quantity: (product.quantity || 1) + 1,
            }
          : product
      )
    );
  };

  const decreaseQuantity = (index) => {
    setCart((currentCart) =>
      currentCart
        .map((product, i) =>
          i === index
            ? {
                ...product,
                quantity: (product.quantity || 1) - 1,
              }
            : product
        )
        .filter(
          (product) => (product.quantity || 1) > 0
        )
    );
  };

  const total = cart.reduce(
    (sum, product) =>
      sum +
      parseFloat(product.price) *
        (product.quantity || 1),
    0
  );

  const placeOrder = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://ecommerence-backend-omega.vercel.app/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_name: customerName,
            customer_email: customerEmail,
            customer_address: customerAddress,
            payment_method: paymentMethod,
            items: cart.map((product) => ({
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: product.quantity || 1,
            })),
            total: total,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessage(
        `Order placed successfully! Order ID: ${data.orderId}`
      );

      setCart([]);
      setCustomerAddress("");
      setPaymentMethod("Cash on Delivery");
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to place order. Please try again."
      );
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="fw-bold mb-4">
          My Cart
        </h2>

        {cart.length === 0 ? (
          <>
            <p className="text-muted">
              Your cart is empty.
            </p>

            {message && (
              <div className="alert alert-success">
                {message}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="row g-3">
              {cart.map((product, index) => (
                <div
                  className="col-md-6"
                  key={`${product.id}-${index}`}
                >
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5 className="fw-bold">
                        {product.name}
                      </h5>

                      <p className="text-primary fw-bold">
                        Rs. {product.price}
                      </p>

                      <div className="d-flex align-items-center mb-3">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            decreaseQuantity(index)
                          }
                        >
                          −
                        </button>

                        <span className="fw-bold mx-3">
                          {product.quantity || 1}
                        </span>

                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            increaseQuantity(index)
                          }
                        >
                          +
                        </button>
                      </div>

                      <p className="fw-bold">
                        Subtotal: Rs.{" "}
                        {(
                          parseFloat(product.price) *
                          (product.quantity || 1)
                        ).toFixed(2)}
                      </p>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          removeFromCart(index)
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h4 className="fw-bold">
                Total: Rs. {total.toFixed(2)}
              </h4>
            </div>

            <div className="card shadow-sm mt-4">
              <div className="card-body">
                <h4 className="fw-bold mb-4">
                  Checkout
                </h4>

                <form onSubmit={placeOrder}>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Your Name"
                    value={customerName}
                    onChange={(e) =>
                      setCustomerName(e.target.value)
                    }
                    required
                  />

                  <input
                    type="email"
                    className="form-control mb-3"
                    placeholder="Your Email"
                    value={customerEmail}
                    onChange={(e) =>
                      setCustomerEmail(e.target.value)
                    }
                    required
                  />

                  <textarea
                    className="form-control mb-3"
                    placeholder="Your Address"
                    rows="3"
                    value={customerAddress}
                    onChange={(e) =>
                      setCustomerAddress(e.target.value)
                    }
                    required
                  />

                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      Payment Method
                    </label>

                    <select
                      className="form-select"
                      value={paymentMethod}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value)
                      }
                    >
                      <option value="Cash on Delivery">
                        💵 Cash on Delivery
                      </option>

                      <option value="JazzCash">
                        📱 JazzCash
                      </option>
                    </select>
                  </div>

                  {paymentMethod === "JazzCash" && (
                    <div className="alert alert-info mb-4">
                      <h5 className="fw-bold">
                        📱 JazzCash Payment
                      </h5>

                      <p className="mb-2">
                        <strong>Account Title:</strong>{" "}
                        Huraira
                      </p>

                      <p className="mb-2">
                        <strong>JazzCash Number:</strong>{" "}
                        03238997928
                      </p>

                      <hr />

                      <p className="mb-0">
                        Please send the total amount to
                        the above JazzCash account and
                        keep your transaction receipt.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-success btn-lg"
                  >
                    Place Order
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Cart;
