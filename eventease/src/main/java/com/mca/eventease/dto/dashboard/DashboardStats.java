package com.mca.eventease.dto.dashboard;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {

    private long totalUsers;

    private long totalEvents;

    private long totalTickets;

    private long totalNotifications;
}