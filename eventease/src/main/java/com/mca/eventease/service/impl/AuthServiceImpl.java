package com.mca.eventease.service.impl;

import com.mca.eventease.dto.auth.AuthResponse;
import com.mca.eventease.dto.auth.LoginRequest;
import com.mca.eventease.dto.auth.RegisterRequest;
import com.mca.eventease.jwt.JwtService;
import com.mca.eventease.model.Role;
import com.mca.eventease.model.User;
import com.mca.eventease.repository.UserRepository;
import com.mca.eventease.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {

            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of(Role.ROLE_ATTENDEE))
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());

        User savedUser = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found after registration"));

        return AuthResponse.builder()
                .token(token)
                .message("User registered successfully")
                .role("ATTENDEE")
                .email(request.getEmail())
                .id(user.getId())
                .fullName(request.getFullName())
                .phone(savedUser.getPhone())
                .bio(savedUser.getBio())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {

            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .message("Login successful")
                .role(user.getRoles().iterator().next().name())
                .email(request.getEmail())
                .id(user.getId())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .bio(user.getBio())
                .build();
    }
}