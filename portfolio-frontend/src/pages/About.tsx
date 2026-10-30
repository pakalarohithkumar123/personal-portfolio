
import { Link } from "react-router-dom";
import "./About.css";

const highlights = [
  {
    icon: "💻",
    title: "Full Stack Development",
    description:
      "Building responsive web applications with React, TypeScript, Java, and Spring Boot.",
  },
  {
    icon: "🗄️",
    title: "Database Management",
    description:
      "Designing structured databases and connecting applications with PostgreSQL.",
  },
  {
    icon: "🚀",
    title: "Real-World Projects",
    description:
      "Turning ideas into practical applications with clean code and user-friendly interfaces.",
  },
  {
    icon: "📚",
    title: "Continuous Learning",
    description:
      "Exploring new technologies, improving problem-solving skills, and learning through practice.",
  },
];

const technologies = [
  "React",
  "TypeScript",
  "Java",
  "Spring Boot",
  "PostgreSQL",
  "HTML & CSS",
  "REST APIs",
  "Git & GitHub",
];

const interests = [
  { icon: "🧑‍💻", title: "Coding", description: "Building and improving applications." },
  { icon: "🧠", title: "Learning", description: "Exploring new tools and technologies." },
  { icon: "🎨", title: "UI Design", description: "Creating clean and intuitive interfaces." },
  { icon: "🛠️", title: "Problem Solving", description: "Finding simple solutions to challenges." },
];

function About() {
  return (
    <div className="about-page">
      {/* INTRODUCTION */}
      <section className="about-hero">
        <div className="about-hero-glow about-glow-one" />
        <div className="about-hero-glow about-glow-two" />

        <div className="about-container about-hero-grid">
          <div className="about-hero-content">
            <span className="about-eyebrow">
              <span className="about-eyebrow-dot" />
              GET TO KNOW ME
            </span>

            <h1>
              About <span>Me</span>
            </h1>

            <h2>
              A passionate developer who loves turning ideas into reality.
            </h2>

            <p className="about-intro">
              Hello! I'm a technology enthusiast focused on building modern,
              responsive, and user-friendly web applications. I enjoy working
              across the frontend and backend, learning new technologies, and
              creating practical solutions to real-world problems.
            </p>

            <div className="about-hero-actions">
              <Link to="/projects" className="about-btn about-btn-primary">
                Explore My Projects <span>↗</span>
              </Link>
              <Link to="/contact" className="about-btn about-btn-secondary">
                Let's Connect
              </Link>
            </div>

            <div className="about-quick-facts">
              <div>
                <strong>4+</strong>
                <span>Core Technologies</span>
              </div>
              <div className="about-fact-divider" />
              <div>
                <strong>Full Stack</strong>
                <span>Development Focus</span>
              </div>
              <div className="about-fact-divider" />
              <div>
                <strong>Always</strong>
                <span>Learning</span>
              </div>
            </div>
          </div>

          <div className="about-hero-visual">
            <div className="about-profile-card">
              <div className="about-profile-top">
                <span className="about-window-dot dot-red" />
                <span className="about-window-dot dot-yellow" />
                <span className="about-window-dot dot-green" />
                <span className="about-profile-label">developer.ts</span>
              </div>

              <div className="about-code">
                <p><span className="code-muted">01</span> <span className="code-purple">const</span> developer = {"{"}</p>
                <p><span className="code-muted">02</span> &nbsp; name: <span className="code-green">"Developer"</span>,</p>
                <p><span className="code-muted">03</span> &nbsp; frontend: <span className="code-green">"React"</span>,</p>
                <p><span className="code-muted">04</span> &nbsp; language: <span className="code-green">"TypeScript"</span>,</p>
                <p><span className="code-muted">05</span> &nbsp; backend: <span className="code-green">"Spring Boot"</span>,</p>
                <p><span className="code-muted">06</span> &nbsp; database: <span className="code-green">"PostgreSQL"</span>,</p>
                <p><span className="code-muted">07</span> &nbsp; mindset: <span className="code-green">"Keep Learning"</span></p>
                <p><span className="code-muted">08</span> {"};"}</p>
              </div>

              <div className="about-code-footer">
                <span className="about-code-status" />
                Ready to build something great
              </div>
            </div>

            <div className="about-float-badge about-float-top">
              <span>⚡</span>
              <div>
                <strong>Creative Thinking</strong>
                <small>Ideas into solutions</small>
              </div>
            </div>

            <div className="about-float-badge about-float-bottom">
              <span>✓</span>
              <div>
                <strong>Full Stack</strong>
                <small>Frontend + Backend</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section className="about-section" id="education">
        <div className="about-container">
          <div className="about-section-heading">
            <span className="about-section-label">MY BACKGROUND</span>
            <h2>Education & Learning</h2>
            <p>
              Building a strong foundation in technology through education,
              hands-on practice, and continuous learning.
            </p>
          </div>

          <div className="about-education-card">
            <div className="about-education-icon">🎓</div>
            <div className="about-education-content">
              <span className="about-card-kicker">HIGHER EDUCATION</span>
              <h3>Master of Technology (M.Tech)</h3>
              <p className="about-education-field">
                Artificial Intelligence and Data Science
              </p>
              <p className="about-education-description">
                Focused on developing technical knowledge, analytical
                thinking, programming skills, and an understanding of modern
                computing technologies.
              </p>
              <div className="about-education-tags">
                <span>Programming</span>
                <span>Artificial Intelligence</span>
                <span>Problem Solving</span>
              </div>
            </div>
            <div className="about-education-badge">Currently Learning</div>
          </div>

          <div className="about-learning-note">
            <span>📖</span>
            <p>
              My learning continues beyond the classroom through practical
              projects, experimentation, and exploring new development tools.
            </p>
          </div>
        </div>
      </section>

      {/* CAREER GOALS */}
      <section className="about-section about-goals-section" id="goals">
        <div className="about-container about-goals-grid">
          <div className="about-section-heading about-goals-heading">
            <span className="about-section-label">WHERE I'M HEADED</span>
            <h2>Career Goals</h2>
            <p>
              My goal is to grow into a skilled full stack developer who
              builds reliable, useful, and accessible software.
            </p>
            <Link to="/contact" className="about-text-link">
              Let's talk about opportunities <span>→</span>
            </Link>
          </div>

          <div className="about-goals-list">
            <article className="about-goal-item">
              <span className="about-goal-number">01</span>
              <div>
                <h3>Build Better Applications</h3>
                <p>
                  Develop scalable applications with clean architecture,
                  responsive interfaces, and dependable APIs.
                </p>
              </div>
            </article>

            <article className="about-goal-item">
              <span className="about-goal-number">02</span>
              <div>
                <h3>Strengthen Technical Skills</h3>
                <p>
                  Improve my knowledge of Java, Spring Boot, React,
                  TypeScript, databases, testing, and deployment.
                </p>
              </div>
            </article>

            <article className="about-goal-item">
              <span className="about-goal-number">03</span>
              <div>
                <h3>Contribute to Real Projects</h3>
                <p>
                  Collaborate with others, solve meaningful problems, and
                  learn professional software development practices.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="about-section" id="highlights">
        <div className="about-container">
          <div className="about-section-heading">
            <span className="about-section-label">WHAT I BRING</span>
            <h2>My Highlights</h2>
            <p>
              The areas I enjoy exploring as I develop my skills and build
              useful digital experiences.
            </p>
          </div>

          <div className="about-highlights-grid">
            {highlights.map((item, index) => (
              <article
                className="about-highlight-card"
                key={item.title}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="about-highlight-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="about-highlight-arrow">↗</span>
              </article>
            ))}
          </div>

          <div className="about-tech-panel">
            <div>
              <span className="about-section-label">MY TOOLKIT</span>
              <h3>Technologies I Work With</h3>
            </div>
            <div className="about-tech-list">
              {technologies.map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PERSONAL INTERESTS */}
      <section className="about-section about-interests-section" id="interests">
        <div className="about-container">
          <div className="about-section-heading">
            <span className="about-section-label">BEYOND THE CODE</span>
            <h2>Personal Interests</h2>
            <p>
              The activities that keep me curious, motivated, and ready to
              take on new challenges.
            </p>
          </div>

          <div className="about-interests-grid">
            {interests.map((interest) => (
              <article className="about-interest-card" key={interest.title}>
                <span className="about-interest-icon">{interest.icon}</span>
                <h3>{interest.title}</h3>
                <p>{interest.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* RESUME DOWNLOAD */}
      <section className="about-resume-section" id="resume">
        <div className="about-container">
          <div className="about-resume-card">
            <div className="about-resume-decoration" />
            <div className="about-resume-content">
              <span className="about-section-label">LET'S CONNECT</span>
              <h2>Want to know more about my journey?</h2>
              <p>
                Download my resume to learn more about my education, technical
                skills, and project experience.
              </p>
              <div className="about-resume-actions">
                <a
                  href="/resume.pdf"
                  className="about-btn about-btn-resume"
                  download
                >
                  <span>↓</span> Download Resume
                </a>
                <Link to="/contact" className="about-resume-contact">
                  Contact Me <span>↗</span>
                </Link>
              </div>
            </div>
            <div className="about-resume-illustration" aria-hidden="true">
              <div className="about-resume-paper">
                <div className="about-paper-heading" />
                <div className="about-paper-line paper-line-short" />
                <div className="about-paper-separator" />
                <div className="about-paper-line" />
                <div className="about-paper-line" />
                <div className="about-paper-line paper-line-short" />
                <div className="about-paper-separator" />
                <div className="about-paper-line" />
                <div className="about-paper-line paper-line-short" />
                <span className="about-paper-check">✓</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
