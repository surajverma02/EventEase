package com.mca.eventease.controller;

import com.mca.eventease.dto.management.StaffRequest;
import com.mca.eventease.dto.management.VendorRequest;
import com.mca.eventease.model.Staff;
import com.mca.eventease.model.Vendor;
import com.mca.eventease.service.ManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manage")
@RequiredArgsConstructor
public class ManagementController {

    private final ManagementService managementService;

    @PostMapping("/vendors")
    public Vendor createVendor(
            @RequestBody VendorRequest request) {

        return managementService.createVendor(request);
    }

    @PostMapping("/staff")
    public Staff createStaff(
            @RequestBody StaffRequest request) {

        return managementService.createStaff(request);
    }

    @PutMapping("/vendors/{vendorId}/assign/{eventId}")
    public Vendor assignVendor(
            @PathVariable String vendorId,
            @PathVariable String eventId) {

        return managementService.assignVendorToEvent(
                vendorId,
                eventId);
    }

    @PutMapping("/staff/{staffId}/assign/{eventId}")
    public Staff assignStaff(
            @PathVariable String staffId,
            @PathVariable String eventId) {

        return managementService.assignStaffToEvent(
                staffId,
                eventId);
    }

    @GetMapping("/vendors")
    public List<Vendor> getAllVendors() {

        return managementService.getAllVendors();
    }

    @GetMapping("/staff")
    public List<Staff> getAllStaff() {

        return managementService.getAllStaff();
    }
}