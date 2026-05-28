package com.mca.eventease.service;

import com.mca.eventease.dto.event.CreateEventRequest;
import com.mca.eventease.model.Event;
import org.springframework.data.domain.Page;

import java.util.List;

public interface EventService {

        Event createEvent(
                        CreateEventRequest request,
                        String organizerEmail);

        List<Event> getAllEvents();

        Event getEventById(String id);

        Event updateEvent(
                        String id,
                        CreateEventRequest request,
                        String organizerEmail);

        void deleteEvent(
                        String id,
                        String organizerEmail);

        Page<Event> searchEvents(
                        String keyword,
                        int page,
                        int size);

        Page<Event> getEventsByStatus(
                        String status,
                        int page,
                        int size);

        Page<Event> getOrganizerEvents(
                        String organizerEmail,
                        int page,
                        int size);

        Page<Event> getEventsByCategory(
                        String category,
                        int page,
                        int size);

        Event save(Event event);
}