package com.mca.eventease.repository;

import com.mca.eventease.model.Event;
import com.mca.eventease.model.EventCategory;
import com.mca.eventease.model.EventStatus;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EventRepository
                extends MongoRepository<Event, String> {

        Page<Event> findByTitleContainingIgnoreCase(
                        String title,
                        Pageable pageable);

        Page<Event> findByStatus(
                        EventStatus status,
                        Pageable pageable);

        Page<Event> findByOrganizerEmail(
                        String organizerEmail,
                        Pageable pageable);

        List<Event> findByOrganizerEmail(String organizerEmail);

        long countByOrganizerEmail(String organizerEmail);

        Page<Event> findAll(Pageable pageable);

        Page<Event> findByCategory(
                        EventCategory category,
                        Pageable pageable);
}