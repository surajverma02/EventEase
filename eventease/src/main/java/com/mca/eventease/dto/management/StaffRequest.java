package com.mca.eventease.dto.management;

import lombok.Data;

@Data
public class StaffRequest {

    private String name;

    private String email;

    private String phone;

    private String role;
}