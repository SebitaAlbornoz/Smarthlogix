package com.storechain.shipment.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private Long id;
    private String address;
    private String client;
}