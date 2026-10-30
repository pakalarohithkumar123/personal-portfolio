
import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string;
  imageUrl: string;
  githubUrl: string;
  liveUrl: string;
}

type ProjectForm = Omit<Project, "id">;

const emptyForm: ProjectForm = {
  title: "",
  description: "",
  technologies: "",
  imageUrl: "",
  githubUrl: "",
  liveUrl: "",
};

const API_URL = "http://localhost:8081/api/projects";

function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return token
      ? { Authorization: `Bearer ${token}` }
      : {};
  };

  const loadProjects = async () => {
    try {
      const response = await axios.get<Project[]>(API_URL);
      setProjects(response.data);
      setError("");
    } catch (err) {
      setError("Could not load projects. Check your backend and API.");
    }
  };

  useEffect(() => {
    void loadProjects();
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (editingId === null) {
        await axios.post(API_URL, form, {
          headers: getHeaders(),
        });
        setMessage("Project added successfully!");
      } else {
        await axios.put(`${API_URL}/${editingId}`, form, {
          headers: getHeaders(),
        });
        setMessage("Project updated successfully!");
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadProjects();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (!err.response) {
          setError("Cannot connect to Spring Boot. Check port 8081.");
        } else if (status === 401) {
          setError("Please sign in again. Authentication is required.");
        } else if (status === 403) {
          setError("Access denied. Check your ADMIN role and Spring Security.");
        } else {
          setError(
            typeof err.response.data?.message === "string"
              ? err.response.data.message
              : `Request failed (${status}). Check the backend console.`
          );
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    const { id, ...projectForm } = project;
    setForm({
      ...emptyForm,
      ...projectForm,
      title: project.title ?? "",
      description: project.description ?? "",
      technologies: project.technologies ?? "",
      imageUrl: project.imageUrl ?? "",
      githubUrl: project.githubUrl ?? "",
      liveUrl: project.liveUrl ?? "",
    });
    setEditingId(id);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: getHeaders(),
      });
      setMessage("Project deleted successfully!");
      await loadProjects();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError("Access denied. Check your ADMIN role and Spring Security.");
      } else {
        setError("Could not delete the project. Check the backend error.");
      }
    }
  };

  return (
    <section className="page-section">
      <div className="section-heading">
        <p>ADMIN PANEL</p>
        <h1>Manage Projects</h1>
        <p>Add, update, and delete portfolio projects.</p>
      </div>

      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}

      <form onSubmit={handleSubmit} className="dashboard-card">
        <h2>{editingId === null ? "Add New Project" : "Edit Project"}</h2>

        <label htmlFor="title">Project Title</label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <label htmlFor="technologies">Technologies</label>
        <input
          id="technologies"
          name="technologies"
          value={form.technologies}
          onChange={handleChange}
          placeholder="React, TypeScript, Spring Boot"
        />

        <label htmlFor="imageUrl">Image URL</label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          value={form.imageUrl}
          onChange={handleChange}
        />

        <label htmlFor="githubUrl">GitHub URL</label>
        <input
          id="githubUrl"
          name="githubUrl"
          type="url"
          value={form.githubUrl}
          onChange={handleChange}
        />

        <label htmlFor="liveUrl">Live Project URL</label>
        <input
          id="liveUrl"
          name="liveUrl"
          type="url"
          value={form.liveUrl}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : editingId === null
              ? "Add Project"
              : "Update Project"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <h2>Existing Projects ({projects.length})</h2>

      <div className="dashboard-grid">
        {projects.map((project) => (
          <article className="dashboard-card" key={project.id}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p>{project.technologies}</p>

            <button type="button" onClick={() => handleEdit(project)}>
              Edit
            </button>

            <button type="button" onClick={() => handleDelete(project.id)}>
              Delete
            </button>
          </article>
        ))}
      </div>

      <p>
        <Link to="/admin">Back to Admin Dashboard</Link>
      </p>
    </section>
  );
}

export default AdminProjects;
