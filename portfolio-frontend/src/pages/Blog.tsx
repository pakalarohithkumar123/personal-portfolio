
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import "./Blog.css";
import { getAuthHeaders } from "../utils/auth";

type BlogPost = {
  id?: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl?: string;
  author?: string;
  publishedAt?: string;
};

type BlogForm = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  author: string;
};

const API_URL = "http://localhost:8081/api/blogs";

const emptyForm: BlogForm = {
  title: "",
  excerpt: "",
  content: "",
  category: "Technology",
  imageUrl: "",
  author: "",
};

function Blog() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getRole = () =>
    (localStorage.getItem("role") || "").toUpperCase();

  const canManageBlogs = () => {
    const role = getRole();
    return (
      role === "ADMIN" ||
      role === "ROLE_ADMIN" ||
      role === "USER" ||
      role === "ROLE_USER"
    );
  };

  const loadBlogs = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Unable to load blogs (${response.status}).`);
      }

      const data: BlogPost[] = await response.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load blog posts. Check the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBlogs();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(blogs.map((blog) => blog.category).filter(Boolean))],
    [blogs]
  );

  const filteredBlogs = useMemo(() => {
    const term = search.trim().toLowerCase();

    return blogs.filter((blog) => {
      const matchesSearch =
        !term ||
        blog.title.toLowerCase().includes(term) ||
        blog.excerpt.toLowerCase().includes(term) ||
        blog.content.toLowerCase().includes(term) ||
        (blog.author || "").toLowerCase().includes(term);

      const matchesCategory =
        selectedCategory === "All" ||
        blog.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [blogs, search, selectedCategory]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      author: localStorage.getItem("name") || "",
    });
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (blog: BlogPost) => {
    if (blog.id == null) return;

    setEditingId(blog.id);
    setForm({
      title: blog.title || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      category: blog.category || "Technology",
      imageUrl: blog.imageUrl || "",
      author: blog.author || "",
    });
    setError("");
    setSuccess("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canManageBlogs()) {
      setError("Please sign in to add or manage blog posts.");
      return;
    }

    if (
      !form.title.trim() ||
      !form.excerpt.trim() ||
      !form.content.trim() ||
      !form.category.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const payload: BlogPost = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      category: form.category.trim(),
      imageUrl: form.imageUrl.trim(),
      author: form.author.trim() || "Portfolio Author",
    };

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const isEditing = editingId !== null;
      const response = await fetch(
        isEditing ? `${API_URL}/${editingId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const details = await response.text();
        throw new Error(
          `Could not ${isEditing ? "update" : "add"} blog (${response.status}). ${
            details || "Check backend authorization and logs."
          }`
        );
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      setSuccess(isEditing ? "Blog updated successfully!" : "Blog added successfully!");

      await loadBlogs();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: number) => {
    if (id == null) return;

    if (!canManageBlogs()) {
      setError("Please sign in to manage blog posts.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(
          `Could not delete blog (${response.status}). Check backend authorization.`
        );
      }

      setBlogs((previous) => previous.filter((blog) => blog.id !== id));
      setSuccess("Blog deleted successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete the blog."
      );
    }
  };

  return (
    <div className="blog-page">
      <section className="blog-hero">
        <span className="blog-eyebrow">MY THOUGHTS & EXPERIENCES</span>
        <h1>My Blog</h1>
        <p>
          Explore ideas, tutorials, experiences, and the latest things I am
          learning in technology.
        </p>
      </section>

      <section className="blog-container">
        <div className="blog-toolbar">
          <input
            type="search"
            className="blog-search"
            placeholder="Search blog posts..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search blog posts"
          />

          <select
            className="blog-category-filter"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            aria-label="Filter by category"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {canManageBlogs() && (
            <button
              type="button"
              className="blog-add-btn"
              onClick={openAddForm}
            >
              + Add Blog
            </button>
          )}
        </div>

        {error && (
          <div className="blog-message blog-error" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="blog-message blog-success" role="status">
            {success}
          </div>
        )}

        {showForm && canManageBlogs() && (
          <form className="blog-form" onSubmit={handleSubmit}>
            <h2>{editingId !== null ? "Edit Blog" : "Create New Blog"}</h2>

            <label htmlFor="blog-title">Title *</label>
            <input
              id="blog-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter blog title"
              maxLength={200}
              required
            />

            <label htmlFor="blog-excerpt">Short Description *</label>
            <textarea
              id="blog-excerpt"
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              placeholder="Write a short introduction"
              maxLength={500}
              rows={3}
              required
            />

            <label htmlFor="blog-content">Full Content *</label>
            <textarea
              id="blog-content"
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Write your blog content"
              rows={7}
              required
            />

            <label htmlFor="blog-category">Category *</label>
            <select
              id="blog-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="Technology">Technology</option>
              <option value="Programming">Programming</option>
              <option value="React">React</option>
              <option value="Java">Java</option>
              <option value="Projects">Projects</option>
              <option value="Career">Career</option>
              <option value="Other">Other</option>
            </select>

            <label htmlFor="blog-image">Image URL (optional)</label>
            <input
              id="blog-image"
              name="imageUrl"
              type="url"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />

            <label htmlFor="blog-author">Author</label>
            <input
              id="blog-author"
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="Enter author name"
              maxLength={100}
            />

            <div className="blog-form-actions">
              <button
                type="submit"
                className="blog-save-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                    ? "Update Blog"
                    : "Publish Blog"}
              </button>

              <button
                type="button"
                className="blog-cancel-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(emptyForm);
                  setError("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="blog-empty">Loading blog posts...</p>
        ) : filteredBlogs.length === 0 ? (
          <div className="blog-empty">
            <h2>No blog posts found</h2>
            <p>
              {blogs.length === 0
                ? "No blogs have been published yet. Sign in to add your first blog."
                : "Try another search term or category."}
            </p>
          </div>
        ) : (
          <div className="blog-grid">
            {filteredBlogs.map((blog) => (
              <article className="blog-card" key={blog.id ?? blog.title}>
                {blog.imageUrl ? (
                  <img
                    className="blog-card-image"
                    src={blog.imageUrl}
                    alt={blog.title}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="blog-card-placeholder">
                    {blog.category || "Blog"}
                  </div>
                )}

                <div className="blog-card-body">
                  <span className="blog-card-category">{blog.category}</span>
                  <h2>{blog.title}</h2>
                  <p className="blog-excerpt">{blog.excerpt}</p>

                  <details className="blog-read-more">
                    <summary>Read More</summary>
                    <div className="blog-full-content">{blog.content}</div>
                  </details>

                  <div className="blog-card-meta">
                    <span>By {blog.author || "Portfolio Author"}</span>
                    <span>
                      {blog.publishedAt
                        ? new Date(blog.publishedAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>

                  {canManageBlogs() && (
                    <div className="blog-card-actions">
                      <button
                        type="button"
                        className="blog-edit-btn"
                        onClick={() => openEditForm(blog)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="blog-delete-btn"
                        onClick={() => void handleDelete(blog.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Blog;
