
import { useState, type FormEvent } from "react";
import axios from "axios";
import "./Contact.css";

const API_URL = "http://localhost:8081/api/contact";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await axios.post(API_URL, {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      setSuccess("Your message has been sent successfully!");
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Contact submission failed:", err);
      setError("Unable to send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-heading">
        <span className="contact-eyebrow">GET IN TOUCH</span>
        <h1>Contact Me</h1>
        <p>
          Have a question or project idea? Send me a message.
          I would love to hear from you.
        </p>
      </section>

      <div className="contact-layout">
        <section className="contact-info">
          <h2>Let's Connect</h2>
          <p>
            Feel free to contact me about projects, opportunities,
            or collaboration.
          </p>

          <div className="contact-info-item">
            <strong>Email</strong>
            <p>your-email@example.com</p>
          </div>

          <div className="contact-info-item">
            <strong>Location</strong>
            <p>Vijayawada, Andhra Pradesh, India</p>
          </div>

          <div className="contact-info-item">
            <strong>Availability</strong>
            <p>Open to learning and collaboration</p>
          </div>
        </section>

        <section className="contact-form-section">
          <h2>Send a Message</h2>

          {success && (
            <p className="contact-success">{success}</p>
          )}

          {error && (
            <p className="contact-error">{error}</p>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <label htmlFor="contact-name">Your Name</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              maxLength={100}
              required
            />

            <label htmlFor="contact-email">Email Address</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              maxLength={150}
              required
            />

            <label htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              placeholder="Enter the subject"
              value={form.subject}
              onChange={handleChange}
              maxLength={200}
              required
            />

            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="Write your message here..."
              value={form.message}
              onChange={handleChange}
              rows={5}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Contact;
