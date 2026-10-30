
package com.klu.portfolio.controller;

import com.klu.portfolio.entity.Skill;
import com.klu.portfolio.service.SkillService;
import com.klu.portfolio.service.EmailService;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174"
})
public class SkillController {

    private final SkillService service;
    private final EmailService emailService;

    public SkillController(
            SkillService service,
            EmailService emailService) {

        this.service = service;
        this.emailService = emailService;
    }

    // Everyone can view skills
    @GetMapping
    public List<Skill> getAllSkills() {
        return service.getAllSkills();
    }

    // Only ADMIN can add skills
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Skill addSkill(
            @RequestBody Skill skill,
            Authentication authentication) {

        if (skill.getName() == null
                || skill.getName().isBlank()
                || skill.getCategory() == null
                || skill.getCategory().isBlank()) {

            throw new IllegalArgumentException(
                "Skill name and category are required"
            );
        }

        skill.setName(skill.getName().trim());
        skill.setCategory(skill.getCategory().trim());

        Skill savedSkill = service.addSkill(skill);

        emailService.notifyNewContent(
            "Skill",
            savedSkill.getName()
                + " (" + savedSkill.getCategory() + ")",
            authentication.getName()
        );

        return savedSkill;
    }

    // Only ADMIN can delete skills
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSkill(@PathVariable Long id) {
        service.deleteSkill(id);
    }
}
