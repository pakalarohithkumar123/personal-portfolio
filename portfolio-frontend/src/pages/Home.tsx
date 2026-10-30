
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [name, setName] = useState(() => {
    const savedName = localStorage.getItem("name");
    const email = localStorage.getItem("email") || "";

    return savedName && savedName !== "undefined"
      ? savedName
      : email.split("@")[0] || "Your Name";
  });

  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    const updateName = () => {
      const savedName = localStorage.getItem("name");
      const email = localStorage.getItem("email") || "";

      setName(
        savedName && savedName !== "undefined"
          ? savedName
          : email.split("@")[0] || "Your Name"
      );
    };

    window.addEventListener("authChanged", updateName);
    window.addEventListener("storage", updateName);

    return () => {
      window.removeEventListener("authChanged", updateName);
      window.removeEventListener("storage", updateName);
    };
  }, []);

  const shareProfile = async () => {
    const profileLink = `${window.location.origin}/profile`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${name}'s Portfolio`,
          text: `Explore ${name}'s portfolio and professional profile.`,
          url: profileLink,
        });
      } else {
        await navigator.clipboard.writeText(profileLink);
        setShareMessage("Profile link copied successfully!");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      try {
        await navigator.clipboard.writeText(profileLink);
        setShareMessage("Profile link copied successfully!");
      } catch {
        setShareMessage(
          "Unable to copy the link. Please copy the website URL."
        );
      }
    }

    window.setTimeout(() => setShareMessage(""), 3000);
  };

  return (
    <section className="home">
      <div className="home-container">
        {/* LEFT CONTENT */}
        <div className="home-content">
          <div className="availability">
            <span></span>
            M.Tech Student | AI & Data Science
          </div>

          <p className="home-small-title">
            WELCOME TO MY PORTFOLIO
          </p>

          <h1>
            Hello, I'm
            <span>{name}</span>
          </h1>

          <h2>Full Stack Developer</h2>

          <p className="home-description">
            I am pursuing M.Tech in Artificial Intelligence and Data
            Science at KL University. I enjoy developing modern,
            responsive web applications and working with frontend,
            backend and database technologies to build practical
            software solutions.
          </p>

          {/* PROFILE BUTTONS */}
          <div className="home-buttons">
            <Link to="/profile" className="main-btn">
              <span>View My Profile</span>
            </Link>

            <button
              type="button"
              className="outline-btn home-share-btn"
              onClick={shareProfile}
            >
              <span>↗</span> Share My Profile
            </button>
          </div>

          {shareMessage && (
            <p className="home-share-message" role="status">
              {shareMessage}
            </p>
          )}

          {/* OTHER LINKS */}
          <div className="home-buttons home-secondary-buttons">
            <Link to="/projects" className="outline-btn">
              View My Projects
            </Link>

            <Link to="/contact" className="outline-btn">
              Contact Me
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="home-visual">
          <div className="portfolio-image-card">
            <img
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=95"
              alt="Developer workspace"
            />

            <div className="image-gradient"></div>

            <div className="image-info">
              <div className="code-icon">
                &lt;/&gt;
              </div>

              <div>
                <h3>{name}</h3>
                <p>Learn • Develop • Innovate</p>
              </div>
            </div>
          </div>

          {/* FLOATING CARDS */}
          <div className="floating-card floating-card-one">
            <span className="floating-icon">⚡</span>
            <div>
              <strong>Full Stack</strong>
              <small>Application Development</small>
            </div>
          </div>

          <div className="floating-card floating-card-two">
            <span className="floating-icon">✓</span>
            <div>
              <strong>Creative Developer</strong>
              <small>Building modern solutions</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
