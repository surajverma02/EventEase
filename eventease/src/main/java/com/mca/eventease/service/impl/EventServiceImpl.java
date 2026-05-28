package com.mca.eventease.service.impl;

import com.mca.eventease.dto.event.CreateEventRequest;
import com.mca.eventease.model.Event;
import com.mca.eventease.model.EventCategory;
import com.mca.eventease.model.EventStatus;
import com.mca.eventease.repository.EventRepository;
import com.mca.eventease.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

        private final EventRepository eventRepository;

        @Override
        public Event createEvent(
                        CreateEventRequest request,
                        String organizerEmail) {

                Event event = Event.builder()
                                .title(request.getTitle())
                                .description(request.getDescription())
                                .venue(request.getVenue())
                                .category(request.getCategory())
                                .startTime(request.getStartTime())
                                .endTime(request.getEndTime())
                                .maxAttendees(request.getMaxAttendees())
                                .registeredAttendees(0)
                                .status(EventStatus.UPCOMING)
                                .organizerEmail(organizerEmail)
                                .createdAt(LocalDateTime.now())
                                .build();

                return eventRepository.save(event);
        }

        @Override
        public List<Event> getAllEvents() {

                return eventRepository.findAll();
        }

        @Override
        public Event getEventById(String id) {

                return eventRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Event not found"));
        }

        @Override
        public Event updateEvent(
                        String id,
                        CreateEventRequest request,
                        String organizerEmail) {

                Event event = getEventById(id);

                if (!event.getOrganizerEmail()
                                .equals(organizerEmail)) {

                        throw new RuntimeException(
                                        "You are not owner of this event");
                }

                event.setTitle(request.getTitle());
                event.setDescription(request.getDescription());
                event.setVenue(request.getVenue());
                event.setCategory(request.getCategory());
                event.setStartTime(request.getStartTime());
                event.setEndTime(request.getEndTime());
                event.setMaxAttendees(request.getMaxAttendees());

                return eventRepository.save(event);
        }

        @Override
        public void deleteEvent(
                        String id,
                        String organizerEmail) {

                Event event = getEventById(id);

                if (!event.getOrganizerEmail()
                                .equals(organizerEmail)) {

                        throw new RuntimeException(
                                        "You are not owner of this event");
                }

                eventRepository.delete(event);
        }

        @Override
        public Page<Event> searchEvents(
                        String keyword,
                        int page,
                        int size) {

                Pageable pageable = PageRequest.of(page, size);

                return eventRepository
                                .findByTitleContainingIgnoreCase(
                                                keyword,
                                                pageable);
        }

        @Override
        public Page<Event> getEventsByStatus(
                        String status,
                        int page,
                        int size) {

                Pageable pageable = PageRequest.of(page, size);

                return eventRepository.findByStatus(
                                EventStatus.valueOf(status),
                                pageable);
        }

        @Override
        public Page<Event> getOrganizerEvents(
                        String organizerEmail,
                        int page,
                        int size) {

                Pageable pageable = PageRequest.of(page, size);

                return eventRepository.findByOrganizerEmail(
                                organizerEmail,
                                pageable);
        }

        @Override
        public Page<Event> getEventsByCategory(
                        String category,
                        int page,
                        int size) {

                Pageable pageable = PageRequest.of(page, size);

                return eventRepository.findByCategory(
                                EventCategory.valueOf(category),
                                pageable);
        }

        @Override
        public Event save(Event event) {

                return eventRepository.save(event);
        }
}