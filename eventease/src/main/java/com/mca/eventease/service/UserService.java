package com.mca.eventease.service;

import com.mca.eventease.dto.auth.UpdatePasswordRequest;
import com.mca.eventease.dto.auth.UpdateUserRequest;
import com.mca.eventease.dto.common.UserResponse;

public interface UserService {

    UserResponse updateUser(String currentEmail, UpdateUserRequest request);

    String updatePassword(String currentEmail, UpdatePasswordRequest request);
}
