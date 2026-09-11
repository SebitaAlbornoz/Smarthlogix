package com.storechain.keyCloakAdapter.exception;

import org.springframework.http.HttpStatus;



public class BussinessRuleException extends Exception{
    private long id;
    private String code;   
    private HttpStatus httpStatus;
    
    public BussinessRuleException(long id, String code, String message,HttpStatus httpStatus) {
        super(message);
        this.id = id;
        this.code = code;
        this.httpStatus = httpStatus;
    }

    public BussinessRuleException(String code, String message,HttpStatus httpStatus) {
        super(message);
        this.code = code;
        this.httpStatus = httpStatus;
    }
    
    public BussinessRuleException(String message, Throwable cause) {
        super(message, cause);
    }     

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }    

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }   

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public void setHttpStatus(HttpStatus httpStatus) {
        this.httpStatus = httpStatus;
    }  
}
