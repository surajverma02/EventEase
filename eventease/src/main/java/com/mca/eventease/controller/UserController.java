package com.mca.eventease.controller;

import com.mca.eventease.dto.auth.UpdatePasswordRequest;
import com.mca.eventease.dto.auth.UpdateUserRequest;
import com.mca.eventease.dto.common.ApiResponse;
import com.mca.eventease.dto.common.UserResponse;
import com.mca.eventease.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public String currentUser(Authentication authentication) {
        return "Logged in as: " + authentication.getName();
    }

    @PutMapping
    public ApiResponse<UserResponse> updateUser(
            Authentication authentication,
            @Valid @RequestBody UpdateUserRequest request) {

        UserResponse updatedUser = userService.updateUser(authentication.getName(), request);

        return ApiResponse.<UserResponse>builder()
                .success(true)
                .message("User profile updated successfully")
                .data(updatedUser)
                .build();
    }

    @PutMapping("/password")
    public ApiResponse<String> updatePassword(
            Authentication authentication,
            @Valid @RequestBody UpdatePasswordRequest request) {

        String message = userService.updatePassword(authentication.getName(), request);

        return ApiResponse.<String>builder()
                .success(true)
                .message(message)
                .data(null)
                .build();
    }
}