package com.storechain.shipment.entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;

    private String address;
    private String carrier;
    private String estimatedDate;
    private String client;

    private String status; // PENDIENTE, EN_TRANSITO, ENTREGADO
}