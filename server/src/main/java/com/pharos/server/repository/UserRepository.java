package com.pharos.server.repository;

import com.pharos.server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    // Spring magically translates this into: SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);

}