package com.storechain.inventory.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor 
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull private String code;
    @NonNull private String title;
    @NonNull private String description;
    @NonNull private Double stock;
    @NonNull private Double price;
    @NonNull
    private String imageSrc;
}