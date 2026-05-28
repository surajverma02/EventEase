package com.mca.eventease.service.impl;

import com.mca.eventease.dto.auth.UpdatePasswordRequest;
import com.mca.eventease.dto.auth.UpdateUserRequest;
import com.mca.eventease.dto.common.UserResponse;
import com.mca.eventease.exception.BusinessException;
import com.mca.eventease.model.User;
import com.mca.eventease.repository.UserRepository;
import com.mca.eventease.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse updateUser(String currentEmail, UpdateUserRequest request) {
        User user = findByEmail(currentEmail);

        if (!user.getEmail().equalsIgnoreCase(request.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email is already in use");
        }

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setBio(request.getBio());

        User updatedUser = userRepository.save(user);

        return mapToResponse(updatedUser);
    }

    @Override
    public String updatePassword(String currentEmail, UpdatePasswordRequest request) {
        User user = findByEmail(currentEmail);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BusinessException("Current password is invalid");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("New password and confirm password must match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return "Password updated successfully";
    }

    private User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("User not found"));
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .bio(user.getBio())
                .build();
    }
}
