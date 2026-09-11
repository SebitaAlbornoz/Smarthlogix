package com.storechain.shipment.common;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NoArgsConstructor;

@Schema(description = "Este modelo permite manejar las excepciones [RFC7230]")
@NoArgsConstructor
@Data
public class ExceptionResponse {
    
    @Schema(description = "Tipo de excepción",name = "type"
            ,requiredMode = Schema.RequiredMode.REQUIRED
            , example = "/error/authentication/not-autorized")
    private String type;
    
    @Schema(description = "Título",name = "title"
            ,requiredMode = Schema.RequiredMode.REQUIRED
            , example = "/error/authentication/not-autorized")
    private String title;
    
    @Schema(description = "Codigo de la excepión",name = "code"
            ,requiredMode = Schema.RequiredMode.NOT_REQUIRED
            , example = "/error/authentication/not-autorized")
    private String code;
    
    @Schema(description = "Detalle",name = "detail"
            ,requiredMode = Schema.RequiredMode.REQUIRED
            , example = "/error/authentication/not-autorized")
    private String detail;
    
    @Schema(description = "Instancia",name = "instance"
            ,requiredMode = Schema.RequiredMode.REQUIRED
            , example = "/error/authentication/not-autorized")
    private String instance;

    public ExceptionResponse(String type, String title, String code, String detail, String instance) {
        this.type = type;
        this.title = title;
        this.code = code;
        this.detail = detail;
        this.instance = instance;
    }
}