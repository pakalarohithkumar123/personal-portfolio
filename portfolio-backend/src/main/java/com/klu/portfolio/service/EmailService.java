
package com.klu.portfolio.service;

import java.util.LinkedHashSet;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger =
            LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Value("${portfolio.notification.admin-email}")
    private String adminEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Send OTP to the user's registered email address
    public boolean sendOtp(
            String recipient,
            String otp,
            String purpose) {

        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(senderEmail);
            message.setTo(recipient);

            message.setSubject(
                    "Portfolio " + purpose + " OTP Verification"
            );

            message.setText(
                    "Hello,\n\n" +
                    "Your OTP for " + purpose +
                    " verification is: " + otp + "\n\n" +
                    "This OTP is valid for 5 minutes.\n" +
                    "You can use this OTP only once.\n\n" +
                    "Do not share this OTP with anyone.\n\n" +
                    "If you did not request this OTP, please ignore this email."
            );

            logger.info(
                    "Sending OTP email. Sender: {}, Recipient: {}",
                    senderEmail,
                    recipient
            );

            mailSender.send(message);

            logger.info(
                    "OTP email successfully sent to {}",
                    recipient
            );

            return true;

        } catch (MailException exception) {

            logger.error(
                    "Failed to send OTP email to {}. Error: {}",
                    recipient,
                    exception.getMessage(),
                    exception
            );

            return false;
        }
    }

    // Send notifications for new projects, blogs and skills
    public void notifyNewContent(
            String contentType,
            String contentName,
            String userEmail) {

        Set<String> recipients = new LinkedHashSet<>();

        recipients.add(adminEmail);

        if (userEmail != null && !userEmail.isBlank()) {
            recipients.add(userEmail);
        }

        for (String recipient : recipients) {

            try {
                SimpleMailMessage message = new SimpleMailMessage();

                message.setFrom(senderEmail);
                message.setTo(recipient);

                message.setSubject(
                        "New " + contentType +
                        " added to Portfolio"
                );

                message.setText(
                        "Hello!\n\n" +
                        "A new " + contentType +
                        " has been added to the portfolio.\n\n" +
                        "Name: " + contentName + "\n\n" +
                        "Thank you!"
                );

                mailSender.send(message);

                logger.info(
                        "Notification email successfully sent to {}",
                        recipient
                );

            } catch (MailException exception) {

                logger.error(
                        "Could not send notification to {}. Error: {}",
                        recipient,
                        exception.getMessage(),
                        exception
                );
            }
        }
    }
}
