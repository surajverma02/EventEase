package com.mca.eventease.dto.event;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import com.mca.eventease.model.EventCategory;

import java.time.LocalDateTime;

@Data
public class CreateEventRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Venue is required")
    private String venue;

    @NotNull(message = "Category is required")
    private EventCategory category;

    @Future
    private LocalDateTime startTime;

    @Future
    private LocalDateTime endTime;

    @Min(1)
    private Integer maxAttendees;
}