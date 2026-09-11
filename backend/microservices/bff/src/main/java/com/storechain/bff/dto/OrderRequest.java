package com.storechain.bff.dto;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    private String client;
    private String address;
    private List<OrderDetailRequest> details;
}
