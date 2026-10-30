
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [name, setName] = useState(() => {
    const savedName = localStorage.getItem("name");
    const email = localStorage.getItem("email") || "";

    return savedName && savedName !== "undefined"
      ? savedName
      : email.split("@")[0] || "User";
  });

  const [loggedIn, setLoggedIn] = useState(
    () =>
      Boolean(
        localStorage.getItem("email") &&
        localStorage.getItem("role")
      )
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    const updateUser = () => {
      const savedName = localStorage.getItem("name");
      const email = localStorage.getItem("email") || "";

      setName(
        savedName && savedName !== "undefined"
          ? savedName
          : email.split("@")[0] || "User"
      );

      setLoggedIn(
        Boolean(
          localStorage.getItem("email") &&
          localStorage.getItem("role")
        )
      );

      setDropdownOpen(false);
    };

    window.addEventListener("authChanged", updateUser);
    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("authChanged", updateUser);
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  const shareProfile = async () => {
    const profileLink = `${window.location.origin}/profile`;

    try {
      await navigator.clipboard.writeText(profileLink);
      setShareMessage("Profile link copied successfully!");
    } catch {
      setShareMessage("Unable to copy profile link.");
    }

    setDropdownOpen(false);
    window.setTimeout(() => setShareMessage(""), 2500);
  };

  const logout = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("token");

    setName("");
    setLoggedIn(false);
    setDropdownOpen(false);

    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
  };

  return (
    <nav className="site-navbar">
      {/* BRAND */}
      <Link to="/" className="nav-brand">
        My <span>Portfolio</span>
      </Link>

      {/* NAVIGATION LINKS */}
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/skills">Skills</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/contact">Contact</Link>
      </div>

      {/* RIGHT SECTION */}
      <div className="nav-right">
        <ThemeSwitcher />

        <div className="nav-account">
          {loggedIn ? (
            <div className="modern-profile">

              {/* USER PROFILE BUTTON */}
              <button
                type="button"
                className="modern-profile-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-label="Open profile menu"
              >
                {/* CIRCULAR FIRST LETTER */}
                <span className="modern-avatar">
                  {name.charAt(0).toUpperCase()}
                </span>

                {/* USERNAME */}
                <span className="modern-profile-name">
                  {name}
                </span>

                {/* DOWN ARROW */}
                <span
                  className={`modern-chevron ${
                    dropdownOpen ? "active" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {/* DROPDOWN MENU */}
              {dropdownOpen && (
                <div className="modern-dropdown">

                  {/* SHARE PROFILE */}
                  <button
                    type="button"
                    className="modern-dropdown-share"
                    onClick={shareProfile}
                  >
                    <span className="dropdown-icon">↗</span>
                    <span>Share Profile</span>
                    <span className="dropdown-external">↗</span>
                  </button>

                  <div className="dropdown-divider"></div>

                  {/* LOGOUT */}
                  <button
                    type="button"
                    className="modern-dropdown-logout"
                    onClick={logout}
                  >
                    <span className="dropdown-icon">⇥</span>
                    <span>Logout</span>
                  </button>

                </div>
              )}
            </div>
          ) : (
            <div className="nav-auth-links">
              <Link to="/signin" className="nav-signin">
                Sign In
              </Link>

              <Link to="/signup" className="nav-signup">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* SHARE MESSAGE */}
      {shareMessage && (
        <div className="modern-share-message" role="status">
          {shareMessage}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
