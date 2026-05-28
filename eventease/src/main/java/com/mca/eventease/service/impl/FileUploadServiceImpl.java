package com.mca.eventease.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.mca.eventease.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class FileUploadServiceImpl
        implements FileUploadService {

    private final Cloudinary cloudinary;

    @Override
    public String uploadFile(
            MultipartFile file) {

        try {

            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.emptyMap());

            return uploadResult
                    .get("secure_url")
                    .toString();

        } catch (Exception e) {

            throw new RuntimeException(
                    "File upload failed");
        }
    }
}