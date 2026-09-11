package com.storechain.shipment.exception;

import com.storechain.shipment.common.ExceptionResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
public class APIExceptionHandler {

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
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ExceptionResponse> handleNotFound(
            NoResourceFoundException ex,
            HttpServletRequest request) {

        ExceptionResponse response = new ExceptionResponse(
                "not-found",
                "Recurso no encontrado",
                "404",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity
                .status(404)
                .body(response);
    }
}