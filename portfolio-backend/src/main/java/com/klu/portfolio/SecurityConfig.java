
package com.klu.portfolio;

import java.util.List;

import com.klu.portfolio.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .cors(cors ->
                cors.configurationSource(corsConfigurationSource()))

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth

                // Signup and signin are public
                .requestMatchers("/api/auth/**").permitAll()

                // Allow CORS preflight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Public visitors can view portfolio content
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/skills",
                    "/api/skills/**",
                    "/api/projects",
                    "/api/projects/**",
                    "/api/blogs",
                    "/api/blogs/**",
                    "/api/about",
                    "/api/about/**"
                ).permitAll()

                // Only ADMIN can add portfolio content
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/skills",
                    "/api/skills/**",
                    "/api/projects",
                    "/api/projects/**",
                    "/api/blogs",
                    "/api/blogs/**",
                    "/api/about",
                    "/api/about/**"
                ).hasRole("ADMIN")

                // Only ADMIN can edit portfolio content
                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/skills",
                    "/api/skills/**",
                    "/api/projects",
                    "/api/projects/**",
                    "/api/blogs",
                    "/api/blogs/**",
                    "/api/about",
                    "/api/about/**"
                ).hasRole("ADMIN")

                // Only ADMIN can delete portfolio content
                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/skills",
                    "/api/skills/**",
                    "/api/projects",
                    "/api/projects/**",
                    "/api/blogs",
                    "/api/blogs/**",
                    "/api/about",
                    "/api/about/**"
                ).hasRole("ADMIN")

                // Anyone can submit a contact form
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/contact",
                    "/api/contact/**"
                ).permitAll()

                // Only ADMIN can view submitted contact messages
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/contact",
                    "/api/contact/**"
                ).hasRole("ADMIN")

                // Only ADMIN can edit or delete contact messages
                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/contact",
                    "/api/contact/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/contact",
                    "/api/contact/**"
                ).hasRole("ADMIN")

                // All other endpoints require authentication
                .anyRequest().authenticated()
            )

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
            "http://localhost:5173",
            "http://localhost:5174"
        ));

        configuration.setAllowedMethods(List.of(
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
