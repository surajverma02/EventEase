package com.mca.eventease.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AuthResponse {

    private String id;

    private String token;

    private String message;

    private String role;

    private String email;

    private String phone;
    
    private String bio;

    private String fullName;
}