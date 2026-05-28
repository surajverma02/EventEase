package com.mca.eventease.controller;

import com.mca.eventease.dto.dashboard.DashboardStats;
import com.mca.eventease.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    public DashboardStats getAdminStats() {

        return dashboardService.getAdminStats();
    }

    @GetMapping("/others/{id}")
    public DashboardStats getOthersStats(@PathVariable String id) {
        
        return dashboardService.getOthersStats(id);
    }
}