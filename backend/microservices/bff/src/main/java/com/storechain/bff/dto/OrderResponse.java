package com.storechain.bff.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private String client;
    private String orderNumber;
    private String status;
    private List<OrderDetailRequest> details;
}