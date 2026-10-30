
package com.klu.portfolio.controller;

import com.klu.portfolio.entity.Project;
import com.klu.portfolio.service.ProjectService;
import com.klu.portfolio.service.EmailService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174"
})
public class ProjectController {

    private final ProjectService projectService;
    private final EmailService emailService;

    public ProjectController(
            ProjectService projectService,
            EmailService emailService) {

        this.projectService = projectService;
        this.emailService = emailService;
    }

    // Everyone can view projects
    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {

        return ResponseEntity.ok(
            projectService.getAllProjects()
        );
    }

    // Everyone can view an individual project
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
            projectService.getProjectById(id)
        );
    }

    // Only ADMIN can add projects
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Project> addProject(
            @RequestBody Project project,
            Authentication authentication) {

        Project saved = projectService.addProject(project);

        String userEmail = authentication.getName();

        emailService.notifyNewContent(
            "Project",
            saved.getTitle(),
            userEmail
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(saved);
    }

    // Only ADMIN can update projects
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(
            @PathVariable Long id,
            @RequestBody Project project) {

        Project updated =
            projectService.updateProject(id, project);

        return ResponseEntity.ok(updated);
    }

    // Only ADMIN can delete projects
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long id) {

        projectService.deleteProject(id);

        return ResponseEntity.noContent().build();
    }
}
