package com.storechain.order.service;

import com.storechain.order.entities.*;
import com.storechain.order.exception.BusinessRuleException;
import com.storechain.order.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private WebClient.Builder webClientBuilder;

    private String generateOrderNumber() {
        return "ORD-" + System.currentTimeMillis();
    }

    public Order createOrder(Order order) {

        if (order.getDetails().isEmpty()) {
            throw new BusinessRuleException("2001", HttpStatus.BAD_REQUEST, "Pedido sin productos");
        }

        for (OrderDetail detail : order.getDetails()) {

            if (order.getDetails() == null || order.getDetails().isEmpty()) {
                throw new BusinessRuleException("2001", HttpStatus.BAD_REQUEST, "Pedido sin productos");
            }

            try {
                // Consultar producto en Inventory
                InventoryResponse product = webClientBuilder.build()
                        .get()
                        .uri("http://localhost:8086/inventory/v1/{id}", detail.getProductId())
                        .retrieve()
                        .bodyToMono(InventoryResponse.class)
                        .block();

                if (product == null) {
                    throw new BusinessRuleException("2002", HttpStatus.NOT_FOUND, "Producto no existe");
                }

                // Validar stock
                if (product.getStock() < detail.getQuantity()) {
                    throw new BusinessRuleException("2003", HttpStatus.BAD_REQUEST, "Stock insuficiente");
                }

                // DESCONTAR STOCK
                webClientBuilder.build()
                        .put()
                        .uri(uriBuilder -> uriBuilder
                                .scheme("http")
                                .host("localhost")
                                .port(8086)
                                .path("/inventory/v1/{id}/stock")
                                .queryParam("quantity", -detail.getQuantity())
                                .build(detail.getProductId()))
                        .retrieve()
                        .bodyToMono(Void.class)
                        .block();

            } catch (Exception ex) {
                ex.printStackTrace(); // 👈 para ver errores reales
                throw new BusinessRuleException(
                        "5020",
                        HttpStatus.BAD_GATEWAY,
                        "Error comunicando con Inventory"
                );
            }

            // relación
            detail.setOrder(order);
        }

        order.setOrderNumber(generateOrderNumber());
        order.setStatus("CREADO");

        return orderRepository.save(order);
    }
    public List<Order> getAll() {
        return orderRepository.findAll();
    }
    public Order getById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException(
                        "2005",
                        HttpStatus.NOT_FOUND,
                        "Pedido no encontrado"
                ));
    }
    public Order changeStatus(Long id, String newStatus) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new BusinessRuleException(
                        "2004",
                        HttpStatus.NOT_FOUND,
                        "Pedido no encontrado"
                ));

        switch (newStatus.toUpperCase()) {

            case "APROBADO":

                if (!order.getStatus().equals("CREADO")) {
                    throw new BusinessRuleException(
                            "2005",
                            HttpStatus.BAD_REQUEST,
                            "Solo pedidos en estado CREADO pueden aprobarse"
                    );
                }

                // 🔥 LLAMADA A SHIPMENT
                try {
                    webClientBuilder.build()
                            .post()
                            .uri("http://localhost:8087/shipment/v1")
                            .bodyValue(order)
                            .retrieve()
                            .bodyToMono(Void.class)
                            .block();

                } catch (Exception ex) {
                    throw new BusinessRuleException(
                            "5030",
                            HttpStatus.BAD_GATEWAY,
                            "Error comunicando con Shipment"
                    );
                }

                order.setStatus("APROBADO");
                break;

            case "RECHAZADO":

                if (!order.getStatus().equals("CREADO")) {
                    throw new BusinessRuleException(
                            "2006",
                            HttpStatus.BAD_REQUEST,
                            "Solo pedidos en estado CREADO pueden rechazarse"
                    );
                }

                order.setStatus("RECHAZADO");
                break;

            default:
                throw new BusinessRuleException(
                        "2007",
                        HttpStatus.BAD_REQUEST,
                        "Estado inválido"
                );
        }

        return orderRepository.save(order);
    }
}