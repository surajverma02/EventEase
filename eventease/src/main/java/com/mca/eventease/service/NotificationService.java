package com.mca.eventease.service;

import com.mca.eventease.model.Notification;

import java.util.List;

public interface NotificationService {

    void createNotification(
            String userEmail,
            String title,
            String message);

    List<Notification> getUserNotifications(
            String userEmail);

    Notification markAsRead(String id);
}