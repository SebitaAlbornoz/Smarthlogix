package com.storechain.inventory.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor; // 🔥 IMPORTANTE
import lombok.AllArgsConstructor; // Opcional pero recomendado
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor // 🔥 Agrega esto para que 'new InventoryMovement()' funcione
@AllArgsConstructor
@Table(name = "inventory_movements")
public class InventoryMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String movementType;
    private Integer quantity;
    private LocalDateTime createdAt;
    private String reason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}