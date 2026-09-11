package com.storechain.order.exception;

import com.storechain.order.common.ExceptionResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class APIExceptionHandler {


    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<ExceptionResponse> handleBusinessRuleException(
            BusinessRuleException ex,
            HttpServletRequest request) {

        ExceptionResponse response = new ExceptionResponse(
                "business-rule-error",                // type
                "Regla de negocio violada",           // title
                ex.getCode(),                         // code
                ex.getMessage(),                      // detail
                request.getRequestURI()               // instance
        );

        return ResponseEntity
                .status(ex.getStatus())
                .body(response);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponse> handleGenericException(
            Exception ex,
            HttpServletRequest request) {

        ExceptionResponse response = new ExceptionResponse(
                "internal-error",
                "Error interno del servidor",
                "9999",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity
                .status(500)
                .body(response);
    }
}