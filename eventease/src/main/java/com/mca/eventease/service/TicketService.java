package com.mca.eventease.service;

import com.mca.eventease.model.Ticket;

import java.util.List;

public interface TicketService {

    Ticket bookTicket(
            String eventId,
            String userEmail);

    List<Ticket> getMyTickets(String userEmail);

    String cancelTicket(String ticketId, String userEmail);
}