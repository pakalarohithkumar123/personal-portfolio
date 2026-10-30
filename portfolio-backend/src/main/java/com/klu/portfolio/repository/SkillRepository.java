package com.klu.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.klu.portfolio.entity.Skill;

public interface SkillRepository extends JpaRepository<Skill, Long> {
}