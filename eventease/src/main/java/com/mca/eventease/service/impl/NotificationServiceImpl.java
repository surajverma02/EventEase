package com.mca.eventease.service.impl;

import com.mca.eventease.exception.ResourceNotFoundException;
import com.mca.eventease.model.Notification;
import com.mca.eventease.repository.NotificationRepository;
import com.mca.eventease.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl
        implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public void createNotification(
            String userEmail,
            String title,
            String message) {

        Notification notification = Notification.builder()
                .userEmail(userEmail)
                .title(title)
                .message(message)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getUserNotifications(
            String userEmail) {

        return notificationRepository
                .findByUserEmailOrderByCreatedAtDesc(
                        userEmail);
    }

    @Override
    public Notification markAsRead(String id) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Notification not found"));

        notification.setRead(true);

        return notificationRepository.save(notification);
    }
}