package com.mca.eventease.service;

import com.mca.eventease.dto.dashboard.DashboardStats;

public interface DashboardService {

    DashboardStats getAdminStats();
    DashboardStats getOthersStats(String id);
}