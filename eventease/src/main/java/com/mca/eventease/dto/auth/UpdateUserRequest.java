package com.mca.eventease.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateUserRequest {

    @NotBlank
    private String fullName;

    @NotBlank
    @Email
    private String email;

    private String phone;

    private String bio;
}
