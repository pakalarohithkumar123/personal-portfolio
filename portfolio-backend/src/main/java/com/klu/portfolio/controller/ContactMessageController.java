
package com.klu.portfolio.controller;

import com.klu.portfolio.entity.ContactMessage;
import com.klu.portfolio.repository.ContactMessageRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174"
})
public class ContactMessageController {

    private final ContactMessageRepository repository;

    public ContactMessageController(
            ContactMessageRepository repository) {
        this.repository = repository;
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication != null
                && authentication.getAuthorities().stream()
                .anyMatch(authority ->
                    authority.getAuthority().equals("ROLE_ADMIN"));
    }

    private boolean canManage(
            ContactMessage message,
            Authentication authentication) {

        if (authentication == null) {
            return false;
        }

        return isAdmin(authentication)
                || Objects.equals(
                    message.getOwnerEmail(),
                    authentication.getName()
                );
    }

    // Submit a message. Associate it with the signed-in user.
    @PostMapping
    public ResponseEntity<ContactMessage> submitMessage(
            @RequestBody ContactMessage contactMessage,
            Authentication authentication) {

        contactMessage.setId(null);
        contactMessage.setCreatedAt(null);

        // Never trust the owner supplied by the frontend.
        if (authentication != null) {
            contactMessage.setOwnerEmail(authentication.getName());
        } else {
            contactMessage.setOwnerEmail(null);
        }

        ContactMessage saved = repository.save(contactMessage);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(saved);
    }

    // Admin sees all messages; users see only their own.
    @GetMapping
    public ResponseEntity<List<ContactMessage>> getMessages(
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        if (isAdmin(authentication)) {
            return ResponseEntity.ok(repository.findAll());
        }

        List<ContactMessage> messages = repository.findAll()
                .stream()
                .filter(message ->
                    Objects.equals(
                        message.getOwnerEmail(),
                        authentication.getName()
                    ))
                .toList();

        return ResponseEntity.ok(messages);
    }

    // Edit a message only if the user owns it or is an admin.
    @PutMapping("/{id}")
    public ResponseEntity<ContactMessage> updateMessage(
            @PathVariable Long id,
            @RequestBody ContactMessage updatedMessage,
            Authentication authentication) {

        ContactMessage existing = repository.findById(id)
                .orElse(null);

        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        if (!canManage(existing, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .build();
        }

        existing.setName(updatedMessage.getName());
        existing.setEmail(updatedMessage.getEmail());
        existing.setSubject(updatedMessage.getSubject());
        existing.setMessage(updatedMessage.getMessage());

        // Preserve the original owner and creation timestamp.
        ContactMessage saved = repository.save(existing);

        return ResponseEntity.ok(saved);
    }

    // Delete a message only if the user owns it or is an admin.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable Long id,
            Authentication authentication) {

        ContactMessage existing = repository.findById(id)
                .orElse(null);

        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        if (!canManage(existing, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .build();
        }

        repository.delete(existing);

        return ResponseEntity.noContent().build();
    }
}
