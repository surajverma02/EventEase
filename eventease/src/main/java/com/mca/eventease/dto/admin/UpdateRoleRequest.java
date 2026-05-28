package com.mca.eventease.dto.admin;

import com.mca.eventease.model.Role;
import lombok.Data;

@Data
public class UpdateRoleRequest {

    private Role role;
}