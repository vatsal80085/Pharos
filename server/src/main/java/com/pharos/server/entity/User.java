package com.pharos.server.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

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

    // SPRING SECURITY USERDETAILS METHODS

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities(){
        // For Pharos v1, everyone is a standard user. No admin roles yet.
        return List.of();
    }

    @Override
    public String getPassword(){
        return this.passwordHash;
    }

    @Override
    public String getUsername(){
        return this.email; // We use email for logging in, so email IS the username
    }

    @Override
    public boolean isAccountNonExpired(){
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
