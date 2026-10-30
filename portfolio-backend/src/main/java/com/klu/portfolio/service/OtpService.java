
package com.klu.portfolio.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.klu.portfolio.entity.EmailOtp;
import com.klu.portfolio.repository.EmailOtpRepository;

@Service
public class OtpService {

    private static final Logger logger =
            LoggerFactory.getLogger(OtpService.class);

    private final EmailOtpRepository otpRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    private final SecureRandom secureRandom = new SecureRandom();

    public OtpService(
            EmailOtpRepository otpRepository,
            EmailService emailService,
            PasswordEncoder passwordEncoder) {

        this.otpRepository = otpRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    // Generate and send OTP
    public void generateOtp(
            String email,
            String purpose,
            String name,
            String passwordHash) {

        String otp = String.format(
                "%06d",
                secureRandom.nextInt(1000000)
        );

        // Remove previous OTP
        otpRepository.deleteByEmailAndPurpose(email, purpose);

        // Create new OTP record
        EmailOtp record = new EmailOtp();

        record.setEmail(email);
        record.setOtpHash(passwordEncoder.encode(otp));
        record.setPurpose(purpose);
        record.setName(name);
        record.setPasswordHash(passwordHash);
        record.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        record.setAttempts(0);

        // Save OTP before sending email
        otpRepository.saveAndFlush(record);

        logger.info("OTP record saved for {}", email);

        // Send OTP to user's email
        boolean sent = emailService.sendOtp(email, otp, purpose);

        if (!sent) {
            logger.error("OTP email delivery failed for {}", email);

            otpRepository.deleteByEmailAndPurpose(email, purpose);

            throw new IllegalStateException(
                    "Unable to send OTP. Check Gmail SMTP configuration."
            );
        }

        logger.info("OTP successfully sent to {}", email);
    }

    // Verify OTP
    @Transactional
    public boolean verifyOtp(
            String email,
            String purpose,
            String otp) {

        Optional<EmailOtp> optionalOtp =
                otpRepository.findByEmailAndPurpose(email, purpose);

        if (optionalOtp.isEmpty()) {
            return false;
        }

        EmailOtp record = optionalOtp.get();

        if (!record.getExpiresAt().isAfter(LocalDateTime.now())
                || record.getAttempts() >= 5) {

            otpRepository.delete(record);
            return false;
        }

        record.setAttempts(record.getAttempts() + 1);

        if (!passwordEncoder.matches(otp, record.getOtpHash())) {
            return false;
        }

        return true;
    }

    // Consume OTP after successful verification
    @Transactional
    public EmailOtp consumeOtp(String email, String purpose) {

        Optional<EmailOtp> optionalOtp =
                otpRepository.findByEmailAndPurpose(email, purpose);

        if (optionalOtp.isEmpty()) {
            throw new IllegalStateException(
                    "OTP verification expired"
            );
        }

        EmailOtp record = optionalOtp.get();

        otpRepository.delete(record);

        return record;
    }
}
