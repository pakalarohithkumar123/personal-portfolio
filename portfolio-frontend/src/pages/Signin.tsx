import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Auth.css";

function Signin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/signin", {
        email: email.trim().toLowerCase(),
        password
      });

      const user = response.data;

      if (!user || !user.token) {
        throw new Error("Invalid sign-in response from server.");
      }

      const role = String(user.role || "USER")
        .toUpperCase()
        .replace("ROLE_", "");

      const displayName =
        user.name || email.trim().split("@")[0];

      localStorage.setItem("id", String(user.id));
      localStorage.setItem("name", displayName);
      localStorage.setItem("email", user.email || email.trim());
      localStorage.setItem("role", role);
      localStorage.setItem("token", user.token);

      window.dispatchEvent(new Event("authChanged"));

      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Sign-in failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">MY PORTFOLIO</div>

        <h2>Welcome Back</h2>

        <p className="auth-subtitle">
          Sign in to manage skills and projects.
        </p>

        {error && (
          <div className="auth-message auth-error">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="signin-email">Email Address</label>
            <input
              id="signin-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="signin-password">Password</label>
            <input
              id="signin-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            className="auth-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>

        <Link to="/" className="auth-home-link">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Signin;