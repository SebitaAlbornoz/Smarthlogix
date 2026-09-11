package com.storechain.bff.controller;

import com.storechain.bff.dto.CheckoutRequest;
import com.storechain.bff.dto.OrderRequest;
import com.storechain.bff.dto.OrderResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/bff/v1")
public class BffController {

    @Autowired
    private WebClient.Builder webClientBuilder;

    @PostMapping("/order")
    public Mono<OrderResponse> create(@RequestBody OrderRequest order) {

        return webClientBuilder.build()
                .post()
                .uri("http://localhost:8089/api/order/v1")
                .bodyValue(order)
                .retrieve()
                .bodyToMono(OrderResponse.class);
    }
    @PostMapping("/checkout")
    public Mono<OrderResponse> checkout(@RequestBody CheckoutRequest request) {

        return webClientBuilder.build()
                .post()
                .uri("http://localhost:8089/api/order/v1")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(OrderResponse.class);
    }
}