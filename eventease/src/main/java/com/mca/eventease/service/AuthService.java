package com.mca.eventease.service;

import com.mca.eventease.dto.auth.AuthResponse;
import com.mca.eventease.dto.auth.LoginRequest;
import com.mca.eventease.dto.auth.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}