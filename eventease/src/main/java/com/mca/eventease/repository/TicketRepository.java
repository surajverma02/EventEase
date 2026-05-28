package com.mca.eventease.repository;

import com.mca.eventease.model.Ticket;
import com.mca.eventease.model.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TicketRepository
        extends MongoRepository<Ticket, String> {

    List<Ticket> findByUserEmail(String userEmail);

    Optional<Ticket> findByUserEmailAndEventId(
            String userEmail,
            String eventId);

    List<Ticket> findByEventId(String eventId);

    long countByUserEmail(String userEmail);

    long countByEventIdIn(List<String> eventIds);

    List<Ticket> findByStatus(TicketStatus status);
}