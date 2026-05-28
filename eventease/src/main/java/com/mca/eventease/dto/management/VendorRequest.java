package com.mca.eventease.dto.management;

import lombok.Data;

@Data
public class VendorRequest {

    private String name;

    private String email;

    private String phone;

    private String serviceType;
}