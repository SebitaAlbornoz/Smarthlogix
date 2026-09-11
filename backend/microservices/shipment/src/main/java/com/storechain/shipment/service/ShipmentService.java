package com.storechain.shipment.service;

import com.storechain.shipment.entities.Shipment;
import com.storechain.shipment.exception.BusinessRuleException;
import com.storechain.shipment.repository.ShipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ShipmentService {

    @Autowired
    private ShipmentRepository repository;

    public Shipment create(Shipment shipment) {
        if (shipment.getOrderId() == null) {
            throw new BusinessRuleException("3001", HttpStatus.BAD_REQUEST, "OrderId es obligatorio");
        }

        shipment.setStatus("ENVIADO");
        shipment.setCarrier("Chile Express");
        shipment.setEstimatedDate(String.valueOf(LocalDate.now().plusDays(3)));

        return repository.save(shipment);
    }

    public Shipment updateStatus(Long id, String status) {

        Shipment shipment = repository.findById(id)
                .orElseThrow(() -> new BusinessRuleException(
                        "3002",
                        HttpStatus.NOT_FOUND,
                        "Envío no encontrado"
                ));

        shipment.setStatus(status);

        return repository.save(shipment);
    }
}