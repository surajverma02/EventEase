package com.mca.eventease.controller;

import com.mca.eventease.dto.event.CreateEventRequest;
import com.mca.eventease.model.Event;
import com.mca.eventease.service.EventService;
import com.mca.eventease.service.FileUploadService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    private final FileUploadService fileUploadService;

    @PostMapping
    public Event createEvent(
            @Valid @RequestBody CreateEventRequest request,
            Authentication authentication) {

        return eventService.createEvent(
                request,
                authentication.getName());
    }

    @GetMapping
    public List<Event> getAllEvents() {

        return eventService.getAllEvents();
    }

    @GetMapping("/{id}")
    public Event getEventById(@PathVariable String id) {

        return eventService.getEventById(id);
    }

    @PutMapping("/{id}")
    public Event updateEvent(
            @PathVariable String id,
            @Valid @RequestBody CreateEventRequest request,
            Authentication authentication) {

        return eventService.updateEvent(
                id,
                request,
                authentication.getName());
    }

    @DeleteMapping("/{id}")
    public String deleteEvent(
            @PathVariable String id,
            Authentication authentication) {

        eventService.deleteEvent(
                id,
                authentication.getName());

        return "Event deleted successfully";
    }

    @GetMapping("/search")
    public Page<Event> searchEvents(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        return eventService.searchEvents(
                keyword,
                page,
                size);
    }

    @GetMapping("/status")
    public Page<Event> getEventsByStatus(
            @RequestParam String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        return eventService.getEventsByStatus(
                status,
                page,
                size);
    }

    @GetMapping("/organizer")
    public Page<Event> getOrganizerEvents(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        return eventService.getOrganizerEvents(
                authentication.getName(),
                page,
                size);
    }

    @GetMapping("/category")
    public Page<Event> getEventsByCategory(
            @RequestParam String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        return eventService.getEventsByCategory(
                category,
                page,
                size);
    }

    @PostMapping("/{id}/banner")
    public Event uploadBanner(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {

        Event event = eventService.getEventById(id);

        String imageUrl = fileUploadService.uploadFile(file);

        event.setBannerUrl(imageUrl);

        return eventService.save(event);
    }
}