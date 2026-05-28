package com.mca.eventease.service.impl;

import com.mca.eventease.dto.admin.UpdateRoleRequest;
import com.mca.eventease.model.User;
import com.mca.eventease.repository.UserRepository;
import com.mca.eventease.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;

    @Override
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

    @Override
    public User updateUserRole(
            String userId,
            UpdateRoleRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.getRoles().clear();

        user.getRoles().add(request.getRole());

        return userRepository.save(user);
    }

    @Override
    public void deleteUser(String userId) {

        userRepository.deleteById(userId);
    }
}