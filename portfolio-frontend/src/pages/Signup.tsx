
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Auth.css";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(email.trim())) {
      setError("Please enter a valid Gmail address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/signup", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role
      });

      setOtpSent(true);

      setSuccess(
        response.data.message || "OTP sent to your Gmail address."
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        `Unable to send OTP (HTTP ${err.response?.status || "Network Error"}).`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/verify-signup", {
        email: email.trim().toLowerCase(),
        otp: otp.trim()
      });

      setSuccess(
        response.data.message ||
        "Email verified and account created successfully!"
      );

      setTimeout(() => navigate("/signin"), 1500);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        `OTP verification failed (HTTP ${err.response?.status || "Network Error"}).`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const response = await api.post("/auth/signup", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role
      });

      setOtp("");

      setSuccess(
        response.data.message || "A new OTP has been sent to your Gmail."
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Unable to resend OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">MY PORTFOLIO</div>

        <h2>{otpSent ? "Verify Your Email" : "Create Account"}</h2>

        <p className="auth-subtitle">
          {otpSent
            ? `Enter the 6-digit OTP sent to ${email}`
            : "Create your account and get started"}
        </p>

        {error && (
          <div className="auth-message auth-error">
            {error}
          </div>
        )}

        {success && (
          <div className="auth-message auth-success">
            {success}
          </div>
        )}

        {!otpSent ? (
          <form className="auth-form" onSubmit={handleSignup}>
            <div className="auth-field">
              <label htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="signup-email">Gmail Address</label>
              <input
                id="signup-email"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="signup-role">Select Account Role</label>

              <select
                id="signup-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <button
              className="auth-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <div className="auth-field">
              <label htmlFor="signup-otp">Enter 6-Digit OTP</label>

              <input
                id="signup-otp"
                type="text"
                inputMode="numeric"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength={6}
                required
              />
            </div>

            <button
              className="auth-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP & Create Account"}
            </button>

            <button
              className="auth-button"
              type="button"
              onClick={handleResendOtp}
              disabled={loading}
              style={{ marginTop: "10px" }}
            >
              {loading ? "Please wait..." : "Resend OTP"}
            </button>
          </form>
        )}

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/signin">Sign In</Link>
        </p>

        <Link to="/" className="auth-home-link">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Signup;
