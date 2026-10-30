interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string;
}

function ProjectCard({
  title,
  description,
  technologies
}: ProjectCardProps) {

  return (
    <div className="modern-project">

      <div className="project-top">

        <div className="project-icon">
          ↗
        </div>

        <span>FEATURED</span>

      </div>

      <div className="project-content">

        <h2>{title}</h2>

        <p>{description}</p>

        <div className="project-tags">

          {technologies.split(" • ").map((tech) => (
            <span key={tech}>
              {tech}
            </span>
          ))}

        </div>

        <button className="project-btn">
          View Case Study →
        </button>

      </div>

    </div>
  );
}

export default ProjectCard;