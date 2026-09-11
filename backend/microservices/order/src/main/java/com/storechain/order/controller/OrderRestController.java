package com.storechain.order.controller;

import com.storechain.order.entities.Order;
import com.storechain.order.service.OrderService;
import com.storechain.order.repository.OrderRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/order/v1")
public class OrderRestController {

    @Autowired
    private OrderService service;

    @PostMapping
    public ResponseEntity<Order> create(@RequestBody Order order) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.createOrder(order));
    }

    @GetMapping
    public ResponseEntity<List<Order>> list() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> get(@PathVariable("id") Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> changeStatus(
            @PathVariable("id") Long id,
            @RequestParam("status") String status) {

        return ResponseEntity.ok(service.changeStatus(id, status));
    }
}