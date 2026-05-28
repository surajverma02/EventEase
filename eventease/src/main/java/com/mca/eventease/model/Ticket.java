package com.mca.eventease.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
// import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;

    private String ticketCode;

    private String userEmail;

    private String eventId;

    private String bannerUrl;

    private String eventCategory;

    private String venue;

    private LocalDateTime eventStartDateTime;

    private String eventTitle;

    private LocalDateTime bookingTime;

    private TicketStatus status;
}