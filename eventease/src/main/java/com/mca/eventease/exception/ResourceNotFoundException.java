package com.mca.eventease.exception;

public class ResourceNotFoundException
        extends RuntimeException {

    public ResourceNotFoundException(String message) {

        super(message);
    }
}