package com.mca.eventease.repository;

import com.mca.eventease.model.Vendor;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface VendorRepository
        extends MongoRepository<Vendor, String> {
}