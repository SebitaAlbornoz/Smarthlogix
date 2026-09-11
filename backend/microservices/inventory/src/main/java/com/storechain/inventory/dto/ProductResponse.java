package com.storechain.inventory.dto;

import lombok.Data;

@Data
public class ProductResponse {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private String imageSrc;
    private int stock;
}