
package com.klu.portfolio.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.klu.portfolio.entity.EmailOtp;

public interface EmailOtpRepository
        extends JpaRepository<EmailOtp, Long> {

    Optional<EmailOtp> findByEmailAndPurpose(
            String email,
            String purpose
    );

    void deleteByEmailAndPurpose(
            String email,
            String purpose
    );
}
