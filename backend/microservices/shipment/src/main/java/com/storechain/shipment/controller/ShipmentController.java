package com.storechain.shipment.controller;

import com.storechain.shipment.entities.Shipment;
import com.storechain.shipment.service.ShipmentService;
import com.storechain.shipment.repository.ShipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shipment/v1")
public class ShipmentController {

    @Autowired
    private ShipmentService service;

    @Autowired
    private ShipmentRepository repository;

    @PostMapping
    public ResponseEntity<Shipment> create(@RequestBody com.storechain.shipment.dto.OrderRequest order) {

        Shipment shipment = new Shipment();
        shipment.setOrderId(order.getId());
        shipment.setAddress(order.getAddress());
        shipment.setClient(order.getClient());

        return ResponseEntity.ok(service.create(shipment));
    }

    @GetMapping
    public ResponseEntity<List<Shipment>> list() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shipment> get(@PathVariable("id") Long id) {
        return ResponseEntity.ok(
                repository.findById(id).orElseThrow()
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Shipment> updateStatus(
            @PathVariable("id") Long id,
            @RequestParam("status") String status) {

        return ResponseEntity.ok(service.updateStatus(id, status));
    }
}