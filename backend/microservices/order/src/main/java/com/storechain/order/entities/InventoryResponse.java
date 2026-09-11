package com.storechain.order.entities;

import lombok.Data;

@Data
public class InventoryResponse {
    private Long id;
    private String name;
    private int stock;
}