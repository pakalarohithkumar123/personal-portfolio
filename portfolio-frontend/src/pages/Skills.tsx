
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { isLoggedIn, getAuthHeaders } from "../utils/auth";
import "./Skills.css";

interface Skill {
  id: number;
  name: string;
  category: string;
  rating: number;
}

const API_URL = "http://localhost:8081/api/skills";
const categories = ["Frontend", "Backend", "Database", "Tools"];

function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [rating, setRating] = useState(80);
  const [showForm, setShowForm] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSkills = useCallback(async () => {
    try {
      setError("");
      const response = await axios.get<Skill[]>(API_URL);
      setSkills(response.data);
    } catch {
      setError("Unable to load skills. Check that Spring Boot is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSkills();
  }, [loadSkills]);

  useEffect(() => {
    const updateLoginStatus = () => {
      const status = isLoggedIn();
      setLoggedIn(status);

      if (!status) {
        setShowForm(false);
      }
    };

    window.addEventListener("authChanged", updateLoginStatus);
    window.addEventListener("storage", updateLoginStatus);

    return () => {
      window.removeEventListener("authChanged", updateLoginStatus);
      window.removeEventListener("storage", updateLoginStatus);
    };
  }, []);

  const handleAdd = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!isLoggedIn()) {
      setError("Please sign in before adding a skill.");
      setLoggedIn(false);
      setShowForm(false);
      return;
    }

    if (!name.trim()) {
      setError("Please enter a skill name.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await axios.post(
        API_URL,
        {
          name: name.trim(),
          category,
          rating,
        },
        {
          headers: getAuthHeaders(),
        }
      );

      setName("");
      setCategory("Frontend");
      setRating(80);
      setShowForm(false);
      setSuccess("Skill added successfully!");

      await loadSkills();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("Your session is not authenticated. Please sign in again.");
      } else if (
        axios.isAxiosError(err) &&
        err.response?.status === 403
      ) {
        setError("You are not authorized to add skills.");
      } else {
        setError("Could not add skill. Check the backend and database.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!isLoggedIn()) {
      setError("Please sign in before deleting a skill.");
      setLoggedIn(false);
      return;
    }

    if (!window.confirm("Are you sure you want to delete this skill?")) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeaders(),
      });

      setSkills((current) =>
        current.filter((skill) => skill.id !== id)
      );

      setSuccess("Skill deleted successfully!");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("Your session is not authenticated. Please sign in again.");
      } else if (
        axios.isAxiosError(err) &&
        err.response?.status === 403
      ) {
        setError("You are not authorized to delete skills.");
      } else {
        setError("Could not delete skill. Check the backend and database.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const groupedSkills = skills.reduce<Record<string, Skill[]>>(
    (groups, skill) => {
      const group = skill.category || "Other";

      if (!groups[group]) {
        groups[group] = [];
      }

      groups[group].push(skill);
      return groups;
    },
    {}
  );

  if (loading) {
    return <main className="skills-page">Loading skills...</main>;
  }

  return (
    <main className="skills-page">
      <header className="skills-title">
        <span className="skills-eyebrow">WHAT I KNOW</span>
        <h1>My Skills</h1>
        <span className="title-underline" />
        <p>Technologies and tools I use to build applications.</p>
      </header>

      {loggedIn && (
        <div className="skills-toolbar">
          <button
            type="button"
            className="add-skill-btn"
            onClick={() => {
              setError("");
              setSuccess("");
              setShowForm((current) => !current);
            }}
          >
            {showForm ? "✕ Close Form" : "+ Add Skill"}
          </button>
        </div>
      )}

      {error && (
        <p className="skills-error" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="skills-success" role="status">
          {success}
        </p>
      )}

      {loggedIn && showForm && (
        <form className="skill-form" onSubmit={handleAdd}>
          <h2>Add New Skill</h2>
          <p>Add a technology and set its proficiency percentage.</p>

          <label htmlFor="skill-name">Skill Name</label>
          <input
            id="skill-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. React"
            maxLength={100}
            required
          />

          <label htmlFor="skill-category">Category</label>
          <select
            id="skill-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <label htmlFor="skill-rating">
            Rating Percentage: <strong>{rating}%</strong>
          </label>

          <input
            id="skill-rating"
            type="range"
            min="0"
            max="100"
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
          />

          <div className="rating-preview">
            <div style={{ width: `${rating}%` }} />
          </div>

          <button
            className="save-skill-btn"
            type="submit"
            disabled={saving}
          >
            {saving ? "Saving..." : "+ Save Skill"}
          </button>
        </form>
      )}

      {skills.length === 0 ? (
        <div className="skills-empty">
          <h2>No skills added yet</h2>
          <p>
            {loggedIn
              ? "Click Add Skill to add technologies to your portfolio."
              : "Skills will appear here when they are added."}
          </p>
        </div>
      ) : (
        <div className="skills-groups">
          {Object.entries(groupedSkills).map(([group, items]) => (
            <section className="skill-category" key={group}>
              <h2>{group}</h2>

              <div className="skill-grid">
                {items.map((skill, index) => {
                  const percentage = Math.max(
                    0,
                    Math.min(100, skill.rating ?? 80)
                  );

                  return (
                    <article className="skill-card" key={skill.id}>
                      <div className="skill-card-top">
                        <span className="skill-symbol">
                          {skill.name.charAt(0).toUpperCase()}
                        </span>

                        <span className="skill-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <h3>{skill.name}</h3>
                      <p className="skill-description">
                        {skill.category}
                      </p>

                      <div className="skill-rating-row">
                        <div
                          className="skill-progress"
                          role="progressbar"
                          aria-label={`${skill.name} proficiency`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={percentage}
                        >
                          <div
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <strong>{percentage}%</strong>
                      </div>

                      {loggedIn && (
                        <div className="skill-card-actions">
                          <button
                            type="button"
                            className="delete-skill-btn"
                            disabled={deletingId === skill.id}
                            onClick={() => void handleDelete(skill.id)}
                          >
                            {deletingId === skill.id
                              ? "Deleting..."
                              : "Delete Skill"}
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

export default Skills;
