package com.mca.eventease.controller;

import com.mca.eventease.dto.admin.UpdateRoleRequest;
import com.mca.eventease.model.User;
import com.mca.eventease.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public List<User> getAllUsers() {

        return adminService.getAllUsers();
    }

    @PutMapping("/users/{userId}/role")
    public User updateUserRole(
            @PathVariable String userId,
            @RequestBody UpdateRoleRequest request) {

        return adminService.updateUserRole(
                userId,
                request);
    }

    @DeleteMapping("/users/{userId}")
    public String deleteUser(
            @PathVariable String userId) {

        adminService.deleteUser(userId);

        return "User deleted successfully";
    }
}