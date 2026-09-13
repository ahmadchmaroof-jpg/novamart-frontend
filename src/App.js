import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header";
import ProductCard from "./Components/Productcard";
import Footer from "./Components/Footer";
import Cart from "./Pages/Cart";
import Admin from "./Pages/Admin";
import AdminLogin from "./Pages/AdminLogin";
import ProductDetails from "./Pages/ProductDetails";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import MyOrders from "./Pages/MyOrders";
import OrderDetails from "./Pages/OrderDetails";

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products?search=${search}`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [search]);

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: (item.quantity || 1) + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (index) => {
    setCart((currentCart) =>
      currentCart.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const scrollToProducts = () => {
    const productsSection = document.getElementById("products");

    if (productsSection) {
      productsSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <BrowserRouter>
      <Header cart={cart} />

      <Routes>
        {/* ADMIN */}
        <Route
          path="/admin"
          element={<Admin />}
        />

        {/* ADMIN LOGIN */}
        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        {/* HOME */}
        <Route
          path="/"
          element={
            <>
              {/* HERO SECTION */}
              <section className="hero-section">
                <div className="hero-animation">
                  <span className="hero-circle circle-1"></span>
                  <span className="hero-circle circle-2"></span>
                  <span className="hero-circle circle-3"></span>
                  <span className="hero-circle circle-4"></span>
                  <span className="hero-circle circle-5"></span>
                </div>

                <div className="hero-content">
                  <div className="hero-badge">
                    ✨ Welcome to our store
                  </div>

                  <h1>
                    My E-Commerce
                    <br />
                    <span>Store</span>
                  </h1>

                  <p>
                    Discover quality products at the best prices.
                    <br />
                    Shop your favorite products with confidence.
                  </p>

                  <button
                    className="btn btn-primary btn-lg hero-button"
                    onClick={scrollToProducts}
                  >
                    Shop Now →
                  </button>
                </div>
              </section>

              {/* PRODUCTS */}
              <section className="py-5" id="products">
                <div className="container">

                  <div className="mb-4 col-md-6 mx-auto">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search products..."
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                    />
                  </div>

                  <h2 className="text-center fw-bold mb-5">
                    Our Products
                  </h2>

                  <div className="row g-4">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        addToCart={addToCart}
                      />
                    ))}
                  </div>

                </div>
              </section>
            </>
          }
        />

        {/* MY ORDERS DETAILS */}
        <Route
          path="/my-orders/:orderId"
          element={<OrderDetails />}
        />

        {/* MY ORDERS */}
        <Route
          path="/my-orders"
          element={<MyOrders />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* PRODUCT DETAILS */}
        <Route
          path="/product/:id"
          element={
            <ProductDetails
              addToCart={addToCart}
            />
          }
        />

        {/* CART */}
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              removeFromCart={removeFromCart}
              setCart={setCart}
            />
          }
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;