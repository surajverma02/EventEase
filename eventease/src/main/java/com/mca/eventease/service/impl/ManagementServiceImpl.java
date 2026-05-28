package com.mca.eventease.service.impl;

import com.mca.eventease.dto.management.StaffRequest;
import com.mca.eventease.dto.management.VendorRequest;
import com.mca.eventease.model.Event;
import com.mca.eventease.model.Staff;
import com.mca.eventease.model.Vendor;
import com.mca.eventease.repository.EventRepository;
import com.mca.eventease.repository.StaffRepository;
import com.mca.eventease.repository.VendorRepository;
import com.mca.eventease.service.ManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ManagementServiceImpl
        implements ManagementService {

    private final VendorRepository vendorRepository;

    private final StaffRepository staffRepository;

    private final EventRepository eventRepository;

    @Override
    public Vendor createVendor(VendorRequest request) {

        Vendor vendor = Vendor.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .serviceType(request.getServiceType())
                .assignedEventIds(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .build();

        return vendorRepository.save(vendor);
    }

    @Override
    public Staff createStaff(StaffRequest request) {

        Staff staff = Staff.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .role(request.getRole())
                .assignedEventIds(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .build();

        return staffRepository.save(staff);
    }

    @Override
    public Vendor assignVendorToEvent(
            String vendorId,
            String eventId) {

        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        vendor.getAssignedEventIds().add(eventId);

        if (event.getVendorIds() == null) {
            event.setVendorIds(new ArrayList<>());
        }

        event.getVendorIds().add(vendorId);

        eventRepository.save(event);

        return vendorRepository.save(vendor);
    }

    @Override
    public Staff assignStaffToEvent(
            String staffId,
            String eventId) {

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        staff.getAssignedEventIds().add(eventId);

        if (event.getStaffIds() == null) {
            event.setStaffIds(new ArrayList<>());
        }

        event.getStaffIds().add(staffId);

        eventRepository.save(event);

        return staffRepository.save(staff);
    }

    @Override
    public List<Vendor> getAllVendors() {

        return vendorRepository.findAll();
    }

    @Override
    public List<Staff> getAllStaff() {

        return staffRepository.findAll();
    }
}