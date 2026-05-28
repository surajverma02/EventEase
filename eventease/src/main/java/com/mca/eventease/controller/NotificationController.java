package com.mca.eventease.controller;

import com.mca.eventease.model.Notification;
import com.mca.eventease.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<Notification> getMyNotifications(
            Authentication authentication) {

        return notificationService
                .getUserNotifications(
                        authentication.getName());
    }

    @PutMapping("/{id}/read")
    public Notification markAsRead(
            @PathVariable String id) {

        return notificationService.markAsRead(id);
    }
}