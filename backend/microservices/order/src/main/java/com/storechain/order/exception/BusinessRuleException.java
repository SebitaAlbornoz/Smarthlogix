package com.storechain.order.exception;

import org.springframework.http.HttpStatus;

public class BusinessRuleException extends RuntimeException {

    private String code;
    private HttpStatus status;

    public BusinessRuleException(String code, HttpStatus status, String message) {
        super(message);
        this.code = code;
        this.status = status;
    }

    public String getCode() {
        return code;
    }

    public HttpStatus getStatus() {
        return status;
    }
}