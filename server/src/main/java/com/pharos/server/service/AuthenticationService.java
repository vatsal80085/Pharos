package com.pharos.server.service;

import com.pharos.server.dto.AuthenticationRequest;
import com.pharos.server.dto.AuthenticationResponse;
import com.pharos.server.dto.RegisterRequest;
import com.pharos.server.entity.User;
import com.pharos.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        // Build the new user and encrypt the password before saving
        var user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .build();

        repository.save(user);

        // Mint the JWT wristband
        var jwtToken = jwtService.generateToken(user);
        return new AuthenticationResponse(jwtToken);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // The AuthenticationManager checks the DB to see if the password matches.
        // If it doesn't match, it throws an error and stops right here.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        // If we get here, the user is legit. Grab them from the DB and mint a token.
        var user = repository.findByEmail(request.email()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);

        return new AuthenticationResponse(jwtToken);
    }
}