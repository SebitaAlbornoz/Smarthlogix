package com.storechain.inventory.service;

import com.storechain.inventory.entities.InventoryMovement;
import com.storechain.inventory.entities.Product;
import com.storechain.inventory.exception.BusinessRuleException;
import com.storechain.inventory.repository.InventoryMovementRepository;
import com.storechain.inventory.repository.ProductRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class InventoryService {

    @Autowired
    private ProductRepository repository;

    @Autowired
    private InventoryMovementRepository movementRepository;

    public List<Product> getAll() {
        return repository.findAll();
    }

    public Product create(Product product) {

        repository.findByCode(product.getCode()).ifPresent(p -> {
            throw new BusinessRuleException("1001",
                    HttpStatus.BAD_REQUEST,
                    "Producto ya existe con ese código");
        });

        if (product.getStock() < 0) {
            throw new BusinessRuleException("1002",
                    HttpStatus.BAD_REQUEST,
                    "Stock no puede ser negativo");
        }

        return repository.save(product);
    }

    public Product updateStock(Long id, int quantity) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("1003",
                        HttpStatus.NOT_FOUND,
                        "Producto no encontrado"));

        Double newStock = product.getStock() + quantity;

        if (newStock < 0) {
            throw new BusinessRuleException("1004",
                    HttpStatus.BAD_REQUEST,
                    "Stock insuficiente");
        }

        product.setStock(newStock);
        Product savedProduct = repository.save(product);

        // Registrar el movimiento en el historial
        InventoryMovement movement = new InventoryMovement();
        movement.setProduct(savedProduct);
        // Si la cantidad es mayor a 0 es un IN (ajuste), si es menor a 0 es un OUT (venta)
        movement.setMovementType(quantity > 0 ? "IN" : "OUT");
        // Guardamos la cantidad siempre en positivo para el historial usando Math.abs
        movement.setQuantity(Math.abs(quantity));
        movement.setReason(quantity > 0 ? "Ajuste de stock" : "Venta / Despacho de Pedido");
        movementRepository.save(movement);

        return savedProduct;
    }
    public Product getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("1003",
                        HttpStatus.NOT_FOUND,
                        "Producto no encontrado"));
    }
    public void delete(Long id) {

        Product product = repository.findById(id)
                .orElseThrow(() -> new BusinessRuleException("1003",
                        HttpStatus.NOT_FOUND,
                        "Producto no encontrado"));

        repository.delete(product);
    }
    // Metodo para Ingreso Manual (Reposición)
    public Product addStockManual(Long productId, Integer quantity, String reason) {
        if (quantity <= 0) {
            throw new BusinessRuleException("3001", HttpStatus.BAD_REQUEST, "La cantidad a ingresar debe ser mayor a 0");
        }

        Product product = repository.findById(productId)
                .orElseThrow(() -> new BusinessRuleException("3002", HttpStatus.NOT_FOUND, "Producto no encontrado"));

        // Actualizar stock del producto
        product.setStock(product.getStock() + quantity);
        repository.save(product);

        // Registrar el movimiento
        InventoryMovement movement = new InventoryMovement();
        movement.setProduct(product);
        movement.setMovementType("IN");
        movement.setQuantity(quantity);
        movement.setReason(reason != null ? reason : "Ingreso manual de stock");
        movementRepository.save(movement);

        return product;
    }

    // Metodo para consultar el historial
    public List<InventoryMovement> getProductHistory(Long productId) {
        return movementRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }
}