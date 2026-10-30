package com.klu.portfolio.service;

import com.klu.portfolio.entity.Skill;
import com.klu.portfolio.repository.SkillRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillService {

    private final SkillRepository repository;

    public SkillService(SkillRepository repository) {
        this.repository = repository;
    }

    public List<Skill> getAllSkills() {
        return repository.findAll();
    }

    public Skill addSkill(Skill skill) {
        skill.setId(null);
        return repository.save(skill);
    }

    public void deleteSkill(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException(
                "Skill not found with id: " + id
            );
        }

        repository.deleteById(id);
    }
}