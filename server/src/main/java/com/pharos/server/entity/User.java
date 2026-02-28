package com.pharos.server.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    private String fullName;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    // Automatically stamps the creation time before saving to the database
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
