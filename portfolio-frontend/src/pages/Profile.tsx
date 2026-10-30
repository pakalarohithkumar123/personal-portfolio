
import { Link } from "react-router-dom";

import About from "./About";
import Skills from "./Skills";
import Projects from "./Projects";
import Blog from "./Blog";

import "./Profile.css";

function Profile() {
  const name =
    localStorage.getItem("name") ||
    localStorage.getItem("email")?.split("@")[0] ||
    "My";

  const shareLink = `${window.location.origin}/profile`;

  const copyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      alert("Your profile link has been copied!");
    } catch {
      alert("Unable to copy the profile link. Please copy it manually.");
    }
  };

  return (
    <div className="public-profile">

      <section className="profile-share-header">
        <div className="profile-share-content">
          <span className="profile-label">PUBLIC PORTFOLIO</span>

          <h1>{name}'s Profile</h1>

          <p>
            Explore my introduction, education, skills, projects,
            experiences, and technical journey in one place.
          </p>

          <div className="profile-share-actions">
            <button onClick={copyProfileLink} type="button">
              ↗ Share My Profile
            </button>

            <Link to="/contact">
              Contact Me
            </Link>
          </div>
        </div>
      </section>

      <nav className="profile-section-nav">
        <a href="#profile-about">About</a>
        <a href="#profile-skills">Skills</a>
        <a href="#profile-projects">Projects</a>
        <a href="#profile-blog">Blog</a>
      </nav>

      <section id="profile-about" className="profile-section">
        <About />
      </section>

      <section id="profile-skills" className="profile-section">
        <Skills />
      </section>

      <section id="profile-projects" className="profile-section">
        <Projects />
      </section>

      <section id="profile-blog" className="profile-section">
        <Blog />
      </section>

      <footer className="profile-footer">
        <h2>Thank you for visiting my profile!</h2>
        <p>Learn • Develop • Innovate</p>
        <button type="button" onClick={copyProfileLink}>
          Share This Profile ↗
        </button>
      </footer>

    </div>
  );
}

export default Profile;
