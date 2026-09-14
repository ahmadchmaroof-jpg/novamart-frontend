import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

function Header({ cart }) {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener("userChanged", loadUser);

    return () => {
      window.removeEventListener("userChanged", loadUser);
    };
  }, []);

  const cartCount = cart.reduce(
    (total, product) => total + (product.quantity || 1),
    0
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowMenu(false);

    window.dispatchEvent(new Event("userChanged"));

    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
      <div className="container">

        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
  <img
    src="/Nova.png"
    alt="NovaMart"
    style={{
      height: "40px",
      width: "40px",
      objectFit: "contain",
      marginRight: "8px",
    }}
  />

  NovaMart
</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >

          <ul className="navbar-nav mx-auto">

            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                href="/#products"
              >
                Products
              </a>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                to="/cart"
              >
                🛒 Cart ({cartCount})
              </Link>
            </li>

          </ul>

          <div className="position-relative">

            {user ? (
              <>
                <button
                  className="btn btn-outline-light"
                  onClick={() =>
                    setShowMenu(!showMenu)
                  }
                >
                  {user.name} ▼
                </button>

                {showMenu && (
                  <div
                    className="position-absolute bg-white shadow rounded p-2"
                    style={{
                      right: 0,
                      top: "100%",
                      marginTop: "8px",
                      minWidth: "130px",
                      zIndex: 1000,
                    }}
                  >
                    <Link
                      className="btn btn-outline-primary btn-sm w-100 mb-2"
                      to="/my-orders"
                      onClick={() => setShowMenu(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      className="btn btn-danger btn-sm w-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                className="btn btn-outline-light"
                to="/login"
              >
                Login
              </Link>
            )}

          </div>

        </div>

      </div>
    </nav>
  );
}

export default Header;
