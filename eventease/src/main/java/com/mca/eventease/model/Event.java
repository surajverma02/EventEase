package com.mca.eventease.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "events")
public class Event {

    @Id
    private String id;

    private String title;

    private String description;

    private String venue;

    private EventCategory category;

    private String bannerUrl;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Integer maxAttendees;

    private Integer registeredAttendees;

    private EventStatus status;

    private String organizerEmail;

    private LocalDateTime createdAt;

    private List<String> vendorIds;

    private List<String> staffIds;
}