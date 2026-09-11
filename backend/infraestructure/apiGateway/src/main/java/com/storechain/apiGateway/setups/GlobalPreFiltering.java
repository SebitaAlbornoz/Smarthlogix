package com.storechain.apiGateway.setups;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;


public class GlobalPreFiltering implements GlobalFilter{

    private static final Logger log = LoggerFactory.getLogger(GlobalPreFiltering.class);
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        log.info("Global Pre filtering excecuted");
        return chain.filter(exchange);
    }
    
}

