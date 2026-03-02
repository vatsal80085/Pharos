package com.pharos.server.config;

import com.pharos.server.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService; // Spring's built-in interface for fetching users

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Grab the Authorization header
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 2. If there's no token, pass it down the chain (Spring Security will reject it later)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extract the token (Start after "Bearer " which is 7 characters)
        jwt = authHeader.substring(7);
        userEmail = jwtService.extractUsername(jwt);

        // 4. If we found an email, and they aren't already authenticated in this session...
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Fetch the user from the database
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // 5. Ask our Factory: Is this wristband valid and unexpired?
            if (jwtService.isTokenValid(jwt, userDetails)) {

                // 6. Create the official Spring Security "VIP Pass"
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                // Add details about the web request itself
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 7. Hand the VIP Pass to Spring Security's context holder
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Always continue the filter chain
        filterChain.doFilter(request, response);
    }
}