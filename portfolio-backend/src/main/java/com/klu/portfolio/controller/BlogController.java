
package com.klu.portfolio.controller;

import com.klu.portfolio.entity.Blog;
import com.klu.portfolio.repository.BlogRepository;
import com.klu.portfolio.service.EmailService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174"
})
public class BlogController {

    private final BlogRepository blogRepository;
    private final EmailService emailService;

    public BlogController(
            BlogRepository blogRepository,
            EmailService emailService) {

        this.blogRepository = blogRepository;
        this.emailService = emailService;
    }

    // Everyone can view all blogs
    @GetMapping
    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    // Everyone can view an individual blog
    @GetMapping("/{id}")
    public ResponseEntity<Blog> getBlogById(
            @PathVariable Long id) {

        return blogRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Only ADMIN can add blogs
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Blog> addBlog(
            @RequestBody Blog blog,
            Authentication authentication) {

        blog.setId(null);

        Blog savedBlog = blogRepository.save(blog);

        emailService.notifyNewContent(
            "Blog",
            savedBlog.getTitle(),
            authentication.getName()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedBlog);
    }

    // Only ADMIN can update blogs
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Blog> updateBlog(
            @PathVariable Long id,
            @RequestBody Blog updatedBlog) {

        return blogRepository.findById(id)
                .map(existingBlog -> {

                    existingBlog.setTitle(updatedBlog.getTitle());
                    existingBlog.setExcerpt(updatedBlog.getExcerpt());
                    existingBlog.setContent(updatedBlog.getContent());
                    existingBlog.setCategory(updatedBlog.getCategory());
                    existingBlog.setImageUrl(updatedBlog.getImageUrl());
                    existingBlog.setAuthor(updatedBlog.getAuthor());

                    Blog savedBlog =
                            blogRepository.save(existingBlog);

                    return ResponseEntity.ok(savedBlog);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Only ADMIN can delete blogs
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlog(
            @PathVariable Long id) {

        if (!blogRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        blogRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
