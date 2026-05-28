package com.mca.eventease.service.impl;

import com.mca.eventease.dto.dashboard.DashboardStats;
import com.mca.eventease.exception.ResourceNotFoundException;
import com.mca.eventease.model.Event;
import com.mca.eventease.model.Role;
import com.mca.eventease.model.Ticket;
import com.mca.eventease.repository.*;
import com.mca.eventease.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl
        implements DashboardService {

    private final UserRepository userRepository;

    private final EventRepository eventRepository;

    private final TicketRepository ticketRepository;

    private final NotificationRepository notificationRepository;

    @Override
    public DashboardStats getAdminStats() {

        return DashboardStats.builder()
                .totalUsers(userRepository.count())
                .totalEvents(eventRepository.count())
                .totalTickets(ticketRepository.count())
                .totalNotifications(
                        notificationRepository.count())
                .build();
    }

    @Override
    public DashboardStats getOthersStats(String id) {

        var user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (user.getRoles() != null && user.getRoles().contains(Role.ROLE_ADMIN)) {
            return getAdminStats();
        }

        String userEmail = user.getEmail();
        long totalNotifications = notificationRepository.countByUserEmail(userEmail);

        if (user.getRoles() != null && user.getRoles().contains(Role.ROLE_ORGANIZER)) {
            List<Event> organizerEvents = eventRepository.findByOrganizerEmail(userEmail);
            long totalEvents = organizerEvents.size();
            long totalTickets = organizerEvents.isEmpty()
                    ? 0
                    : ticketRepository.countByEventIdIn(
                            organizerEvents.stream()
                                            .map(Event::getId)
                                            .collect(Collectors.toList()));

            return DashboardStats.builder()
                    .totalEvents(totalEvents)
                    .totalTickets(totalTickets)
                    .totalNotifications(totalNotifications)
                    .totalUsers(0)
                    .build();
        }

        List<Ticket> attendeeTickets = ticketRepository.findByUserEmail(userEmail);
        long totalEvents = attendeeTickets.stream()
                .map(Ticket::getEventId)
                .distinct()
                .count();
        long totalTickets = attendeeTickets.size();

        return DashboardStats.builder()
                .totalEvents(totalEvents)
                .totalTickets(totalTickets)
                .totalNotifications(totalNotifications)
                .totalUsers(0)
                .build();
    }
}