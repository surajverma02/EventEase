package com.mca.eventease.service.impl;

import com.mca.eventease.model.*;
import com.mca.eventease.repository.EventRepository;
import com.mca.eventease.repository.TicketRepository;
import com.mca.eventease.service.NotificationService;
import com.mca.eventease.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

        private final TicketRepository ticketRepository;

        private final EventRepository eventRepository;

        private final NotificationService notificationService;

        @Override
        public Ticket bookTicket(
                        String eventId,
                        String userEmail) {

                Event event = eventRepository.findById(eventId)
                                .orElseThrow(() -> new RuntimeException("Event not found"));

                if (event.getRegisteredAttendees() >= event.getMaxAttendees()) {

                        throw new RuntimeException("Event is full");
                }

                boolean alreadyBooked = ticketRepository.findByUserEmailAndEventId(
                                userEmail,
                                eventId).isPresent();

                if (alreadyBooked) {

                        throw new RuntimeException(
                                        "You already booked this event");
                }

                Ticket ticket = Ticket.builder()
                                .ticketCode(UUID.randomUUID().toString())
                                .userEmail(userEmail)
                                .eventId(eventId)
                                .eventTitle(event.getTitle())
                                .bannerUrl(event.getBannerUrl())
                                .eventCategory(event.getCategory().toString())
                                .venue(event.getVenue())
                                .eventStartDateTime(event.getStartTime())
                                .bookingTime(LocalDateTime.now())
                                .status(TicketStatus.BOOKED)
                                .build();

                event.setRegisteredAttendees(
                                event.getRegisteredAttendees() + 1);

                eventRepository.save(event);

                notificationService.createNotification(
                                userEmail,
                                "Ticket Booked",
                                "You successfully booked ticket for event: "
                                                + event.getTitle());

                return ticketRepository.save(ticket);
        }

        @Override
        public List<Ticket> getMyTickets(String userEmail) {

                return ticketRepository.findByUserEmail(userEmail);
        }

        @Override
        public String cancelTicket(
                        String ticketId,
                        String userEmail) {

                Ticket ticket = ticketRepository.findById(ticketId)
                                .orElseThrow(() -> new RuntimeException("Ticket not found"));

                if (!ticket.getUserEmail().equals(userEmail)) {

                        throw new RuntimeException(
                                        "Unauthorized ticket cancellation");
                }

                if (ticket.getStatus() == TicketStatus.CANCELLED) {

                        throw new RuntimeException(
                                        "Ticket already cancelled");
                }

                Event event = eventRepository.findById(
                                ticket.getEventId()).orElseThrow(() -> new RuntimeException("Event not found"));

                event.setRegisteredAttendees(
                                event.getRegisteredAttendees() - 1);

                eventRepository.save(event);

                ticket.setStatus(TicketStatus.CANCELLED);

                ticketRepository.save(ticket);

                notificationService.createNotification(
                                userEmail,
                                "Ticket Cancelled",
                                "Your ticket has been cancelled for event: "
                                                + event.getTitle());

                return "Ticket cancelled successfully";
        }
}