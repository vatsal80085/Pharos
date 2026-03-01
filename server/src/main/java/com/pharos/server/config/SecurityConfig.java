package com.pharos.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Crucial: Postman POST requests will 403 if this isn't disabled
                .authorizeHttpRequests(auth -> auth
                        // Add "/error" to the list of permitted paths
                        .requestMatchers("/api/status", "/api/files/**", "/error").permitAll()
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}