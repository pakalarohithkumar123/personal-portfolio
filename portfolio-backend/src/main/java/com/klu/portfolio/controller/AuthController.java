package com.klu.portfolio.controller;

import com.klu.portfolio.entity.User;
import com.klu.portfolio.entity.EmailOtp;
import com.klu.portfolio.repository.UserRepository;
import com.klu.portfolio.security.JwtUtil;
import com.klu.portfolio.service.OtpService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174"
})
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            OtpService otpService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.otpService = otpService;
    }

    private ResponseEntity<?> error(String message, HttpStatus status) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        return ResponseEntity.status(status).body(response);
    }

    // STEP 1: Request signup OTP
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {

        if (user.getName() == null ||
            user.getEmail() == null ||
            user.getPassword() == null ||
            user.getName().isBlank() ||
            user.getEmail().isBlank() ||
            user.getPassword().isBlank()) {
            return error("All fields are required", HttpStatus.BAD_REQUEST);
        }

        String name = user.getName().trim();
        String email = user.getEmail().trim().toLowerCase();

        if (userRepository.findByEmail(email).isPresent()) {
            return error("Email is already registered", HttpStatus.CONFLICT);
        }

        String passwordHash = passwordEncoder.encode(user.getPassword());

        try {
            otpService.generateOtp(email, "SIGNUP", name, passwordHash);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Signup OTP sent to your email");
            response.put("email", email);

            return ResponseEntity.ok(response);

        } catch (Exception exception) {
            return error("Unable to send OTP. Please try again.",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // STEP 2: Verify signup OTP and create account
    @PostMapping("/verify-signup")
    public ResponseEntity<?> verifySignup(
            @RequestBody Map<String, String> request) {

        String email = request.get("email");
        String otp = request.get("otp");

        if (email == null || otp == null ||
                !otp.matches("\\d{6}")) {
            return error("Valid email and 6-digit OTP are required",
                    HttpStatus.BAD_REQUEST);
        }

        email = email.trim().toLowerCase();

        if (!otpService.verifyOtp(email, "SIGNUP", otp)) {
            return error("Invalid or expired OTP", HttpStatus.UNAUTHORIZED);
        }

        try {
            EmailOtp verifiedOtp = otpService.consumeOtp(email, "SIGNUP");

            if (userRepository.findByEmail(email).isPresent()) {
                return error("Email is already registered", HttpStatus.CONFLICT);
            }

            User newUser = new User();
            newUser.setName(verifiedOtp.getName());
            newUser.setEmail(verifiedOtp.getEmail());
            newUser.setPassword(verifiedOtp.getPasswordHash());
            newUser.setRole("USER");

            User savedUser = userRepository.save(newUser);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Signup successful");
            response.put("name", savedUser.getName());
            response.put("email", savedUser.getEmail());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception exception) {
            return error("Signup failed. Please try again.",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // STEP 3: Signin directly using email and password (NO OTP)
    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody User user) {

        if (user.getEmail() == null || user.getPassword() == null ||
                user.getEmail().isBlank() || user.getPassword().isBlank()) {
            return error("Email and password are required",
                    HttpStatus.BAD_REQUEST);
        }

        String email = user.getEmail().trim().toLowerCase();

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return error("Invalid email or password",
                    HttpStatus.UNAUTHORIZED);
        }

        User existingUser = optionalUser.get();

        if (!passwordEncoder.matches(
                user.getPassword(),
                existingUser.getPassword())) {
            return error("Invalid email or password",
                    HttpStatus.UNAUTHORIZED);
        }

        // Generate JWT immediately after successful password validation
        String token = jwtUtil.generateToken(
                existingUser.getEmail(),
                existingUser.getRole()
        );

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Signin successful");
        response.put("id", existingUser.getId());
        response.put("name", existingUser.getName());
        response.put("email", existingUser.getEmail());
        response.put("role", existingUser.getRole());
        response.put("token", token);

        return ResponseEntity.ok(response);
    }
}