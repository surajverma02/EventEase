package com.mca.eventease.service;

import com.mca.eventease.dto.admin.UpdateRoleRequest;
import com.mca.eventease.model.User;

import java.util.List;

public interface AdminService {

    List<User> getAllUsers();

    User updateUserRole(
            String userId,
            UpdateRoleRequest request);

    void deleteUser(String userId);
}