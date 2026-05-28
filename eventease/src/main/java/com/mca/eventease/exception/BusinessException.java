package com.mca.eventease.exception;

public class BusinessException
        extends RuntimeException {

    public BusinessException(String message) {

        super(message);
    }
}