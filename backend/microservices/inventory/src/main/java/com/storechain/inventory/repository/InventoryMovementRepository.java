package com.storechain.inventory.repository;

import com.storechain.inventory.entities.InventoryMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryMovementRepository extends JpaRepository<InventoryMovement, Long> {
    // Para traer el historial de un producto ordenado por el más reciente
    List<InventoryMovement> findByProductIdOrderByCreatedAtDesc(Long productId);
}