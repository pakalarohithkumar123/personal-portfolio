
import {
  useEffect,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { isLoggedIn, getAuthHeaders } from "../utils/auth";
import "./Projects.css";

type Project = {
  id?: number;
  title: string;
  description: string;
  technologies?: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
};

const API_URL = "http://localhost:8081/api/projects";

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState<Project>({
    title: "",
    description: "",
    technologies: "",
    imageUrl: "",
    githubUrl: "",
    liveUrl: "",
  });

  useEffect(() => {
    const updateLoginStatus = () => setLoggedIn(isLoggedIn());

    window.addEventListener("authChanged", updateLoginStatus);
    window.addEventListener("storage", updateLoginStatus);

    return () => {
      window.removeEventListener("authChanged", updateLoginStatus);
      window.removeEventListener("storage", updateLoginStatus);
    };
  }, []);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`Could not load projects (${response.status})`);
        }

        const data: Project[] = await response.json();
        setProjects(data);
      } catch (err) {
        console.error("Project loading error:", err);
        setError("Could not load projects. Check whether the backend is running.");
      }
    };

    loadProjects();
  }, []);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!isLoggedIn()) {
      setLoggedIn(false);
      setError("Please sign in before adding a project.");
      return;
    }

    if (!form.title.trim() || !form.description.trim()) {
      setError("Please enter a project title and description.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          ...form,
          title: form.title.trim(),
          description: form.description.trim(),
        }),
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(details || `Project creation failed (${response.status})`);
      }

      const savedProject: Project = await response.json();

      setProjects((previous) => [...previous, savedProject]);

      setForm({
        title: "",
        description: "",
        technologies: "",
        imageUrl: "",
        githubUrl: "",
        liveUrl: "",
      });

      setShowForm(false);
      setMessage("Project added successfully!");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to add project. Check your backend."
      );
      console.error("Project upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (project: Project) => {
    if (!isLoggedIn()) {
      setLoggedIn(false);
      setError("Please sign in before deleting a project.");
      return;
    }

    if (project.id == null) {
      setError("This project has no database ID and cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");
    setDeletingId(project.id);

    try {
      const response = await fetch(`${API_URL}/${project.id}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(details || `Failed to delete project (${response.status})`);
      }

      setProjects((previous) =>
        previous.filter((item) => item.id !== project.id)
      );

      setMessage("Project deleted successfully!");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete project. Check your backend."
      );
      console.error("Project deletion error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="projects-page">
      <div className="projects-heading">
        <p className="projects-eyebrow">MY WORK</p>
        <h1>Projects</h1>
        <div className="projects-heading-line"></div>
      </div>

      {loggedIn && (
        <div className="projects-toolbar">
          <button
            type="button"
            className="add-project-btn"
            onClick={() => {
              setShowForm((previous) => !previous);
              setError("");
              setMessage("");
            }}
          >
            {showForm ? "Cancel" : "+ Add Project"}
          </button>
        </div>
      )}

      {message && (
        <p className="project-message project-success" role="status">
          {message}
        </p>
      )}

      {error && (
        <p className="project-message project-error" role="alert">
          {error}
        </p>
      )}

      {loggedIn && showForm && (
        <form className="project-form" onSubmit={handleSubmit}>
          <h2>Add a New Project</h2>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Project title *"
            aria-label="Project title"
            required
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Project description *"
            aria-label="Project description"
            rows={4}
            required
          />

          <input
            name="technologies"
            value={form.technologies}
            onChange={handleChange}
            placeholder="Technologies (e.g. React, Spring Boot)"
            aria-label="Technologies"
          />

          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="Image URL (optional)"
            aria-label="Image URL"
          />

          <input
            name="githubUrl"
            value={form.githubUrl}
            onChange={handleChange}
            placeholder="GitHub URL (optional)"
            aria-label="GitHub URL"
          />

          <input
            name="liveUrl"
            value={form.liveUrl}
            onChange={handleChange}
            placeholder="Live project URL (optional)"
            aria-label="Live project URL"
          />

          <button
            type="submit"
            className="save-project-btn"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Project"}
          </button>
        </form>
      )}

      <div className="projects-grid">
        {projects.map((project, index) => (
          <article
            className="project-card"
            key={project.id ?? `${project.title}-${index}`}
          >
            <div className="project-top">
              <div className="project-icon">&lt;/&gt;</div>
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>

            <h2>{project.title}</h2>

            <p className="project-description">{project.description}</p>

            {project.technologies && (
              <p className="project-technologies">
                <strong>Technologies:</strong> {project.technologies}
              </p>
            )}

            <div className="project-card-actions">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="project-btn project-link-btn"
                >
                  GitHub ↗
                </a>
              )}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="project-btn project-link-btn"
                >
                  View Project ↗
                </a>
              )}

              {loggedIn && (
                <button
                  type="button"
                  className="project-btn delete-project-btn"
                  onClick={() => handleDelete(project)}
                  disabled={deletingId === project.id}
                >
                  {deletingId === project.id
                    ? "Deleting..."
                    : "Delete Project"}
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      {projects.length === 0 && (
        <p className="projects-empty">
          No projects available.
          {loggedIn
            ? ' Click "+ Add Project" to add one.'
            : " Please sign in to add projects."}
        </p>
      )}
    </section>
  );
}

export default Projects;
