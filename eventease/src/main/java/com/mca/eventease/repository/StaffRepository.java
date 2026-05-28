package com.mca.eventease.repository;

import com.mca.eventease.model.Staff;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StaffRepository
        extends MongoRepository<Staff, String> {
}