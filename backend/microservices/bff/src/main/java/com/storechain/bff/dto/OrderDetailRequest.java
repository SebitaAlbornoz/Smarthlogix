package com.storechain.bff.dto;


import lombok.Data;

@Data
public class OrderDetailRequest {
    private Long productId;
    private Integer quantity;
}