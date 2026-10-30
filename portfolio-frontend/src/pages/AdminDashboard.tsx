
import { Link, Navigate } from "react-router-dom";

function AdminDashboard() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.replace(/^ROLE_/, "");
  const name = localStorage.getItem("name") || "Admin";

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  if (role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="page-section">
      <div className="section-heading">
        <p>ADMIN PANEL</p>
        <h1>Welcome, {name}</h1>
        <p>Manage your portfolio website.</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Profile</h2>
          <p>Manage your profile information.</p>
          <Link to="/admin/profile" className="secondary-btn">
            Manage Profile
          </Link>
        </div>

        <div className="dashboard-card">
          <h2>Projects</h2>
          <p>Add, edit, and delete portfolio projects.</p>
          <Link to="/admin/projects" className="secondary-btn">
            Manage Projects
          </Link>
        </div>

        <div className="dashboard-card">
          <h2>Skills</h2>
          <p>Manage your technical skills.</p>
          <Link to="/admin/skills" className="secondary-btn">
            Manage Skills
          </Link>
        </div>

        <div className="dashboard-card">
          <h2>Blogs</h2>
          <p>Create and manage blog posts.</p>
          <Link to="/admin/blogs" className="secondary-btn">
            Manage Blogs
          </Link>
        </div>

        <div className="dashboard-card">
          <h2>Messages</h2>
          <p>View messages received from visitors.</p>
          <Link to="/admin/messages" className="secondary-btn">
            View Messages
          </Link>
        </div>
      </div>

      <div className="dashboard-back">
        <Link to="/" className="secondary-btn">
          Back to Website
        </Link>
      </div>
    </section>
  );
}

export default AdminDashboard;
