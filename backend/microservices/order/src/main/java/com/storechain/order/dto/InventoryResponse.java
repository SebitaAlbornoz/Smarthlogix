package com.storechain.order.dto;

import lombok.Data;

@Data
public class InventoryResponse {

    private Long id;
    private String name;
    private int stock;
}