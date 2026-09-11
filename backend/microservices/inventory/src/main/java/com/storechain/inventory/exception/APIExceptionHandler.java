package com.storechain.inventory.exception;

import com.storechain.inventory.common.ExceptionResponse;
import com.storechain.inventory.exception.BusinessRuleException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class APIExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(APIExceptionHandler.class);

    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<ExceptionResponse> handleBusinessRuleException(
            BusinessRuleException ex,
            HttpServletRequest request) {

        ExceptionResponse response = new ExceptionResponse(
                "business-rule-error",
                "Regla de negocio violada",
                ex.getCode(),
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity
                .status(ex.getStatus())
                .body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponse> handleGenericException(
            Exception ex,
            HttpServletRequest request) {

        ex.printStackTrace(); // 👈 ESTA LÍNEA AGREGA

        ExceptionResponse response = new ExceptionResponse(
                "internal-error",
                "Error interno del servidor",
                "9999",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(500).body(response);
    }
}