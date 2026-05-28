package com.mca.eventease.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "vendors")
public class Vendor {

    @Id
    private String id;

    private String name;

    private String email;

    private String phone;

    private String serviceType;

    private List<String> assignedEventIds;

    private LocalDateTime createdAt;
}