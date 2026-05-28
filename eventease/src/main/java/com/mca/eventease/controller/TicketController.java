package com.mca.eventease.controller;

import com.mca.eventease.model.Ticket;
import com.mca.eventease.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping("/book/{eventId}")
    public Ticket bookTicket(
            @PathVariable String eventId,
            Authentication authentication) {

        return ticketService.bookTicket(
                eventId,
                authentication.getName());
    }

    @GetMapping("/my")
    public List<Ticket> getMyTickets(
            Authentication authentication) {

        return ticketService.getMyTickets(
                authentication.getName());
    }

    @PutMapping("/cancel/{ticketId}")
    public String cancelTicket(
            @PathVariable String ticketId,
            Authentication authentication) {

        return ticketService.cancelTicket(
                ticketId,
                authentication.getName());
    }
}