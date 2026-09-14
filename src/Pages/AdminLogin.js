import { useState } from "react";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch(
      "https://ecommerence-backend-omega.vercel.app/api/admin/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    localStorage.setItem("adminToken", data.token);

    window.location.href = "/admin";
  };

  return (
    <section className="admin-login-page py-5">
      <div className="container">

        <div className="admin-login-card card shadow-sm p-4">

          <div className="admin-login-icon">
            🔐
          </div>

          <h2 className="fw-bold mb-2 text-center">
            Admin Login
          </h2>

          <p className="admin-login-subtitle text-center mb-4">
            Sign in to manage your store
          </p>

          <form onSubmit={handleLogin}>

            <div className="mb-3">
              <label className="form-label">
                Username
              </label>

              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder="Enter username"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">
                Password
              </label>

              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
            >
              Login to Admin Panel
            </button>

          </form>

        </div>

      </div>
    </section>
  );
}

export default AdminLogin;
