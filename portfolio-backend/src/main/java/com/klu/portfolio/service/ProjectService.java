
package com.klu.portfolio.service;

import com.klu.portfolio.entity.Project;
import com.klu.portfolio.repository.ProjectRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Project not found with ID: " + id
                ));
    }

    public Project addProject(Project project) {
        project.setId(null);
        return projectRepository.save(project);
    }

    public Project updateProject(Long id, Project updatedProject) {
        Project existing = getProjectById(id);

        existing.setTitle(updatedProject.getTitle());
        existing.setDescription(updatedProject.getDescription());
        existing.setTechnologies(updatedProject.getTechnologies());
        existing.setImageUrl(updatedProject.getImageUrl());
        existing.setGithubUrl(updatedProject.getGithubUrl());
        existing.setLiveUrl(updatedProject.getLiveUrl());

        return projectRepository.save(existing);
    }

    public void deleteProject(Long id) {
        Project existing = getProjectById(id);
        projectRepository.delete(existing);
    }
}
