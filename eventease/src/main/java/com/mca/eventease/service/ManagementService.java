package com.mca.eventease.service;

import com.mca.eventease.dto.management.StaffRequest;
import com.mca.eventease.dto.management.VendorRequest;
import com.mca.eventease.model.Staff;
import com.mca.eventease.model.Vendor;

import java.util.List;

public interface ManagementService {

    Vendor createVendor(VendorRequest request);

    Staff createStaff(StaffRequest request);

    Vendor assignVendorToEvent(
            String vendorId,
            String eventId);

    Staff assignStaffToEvent(
            String staffId,
            String eventId);

    List<Vendor> getAllVendors();

    List<Staff> getAllStaff();
}