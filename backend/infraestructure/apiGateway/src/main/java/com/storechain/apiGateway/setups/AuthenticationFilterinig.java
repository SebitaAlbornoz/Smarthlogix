package com.storechain.apiGateway.setups;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.net.HttpHeaders;
import io.micrometer.common.util.StringUtils;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.OrderedGatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;


@Slf4j
@Component
public class AuthenticationFilterinig  extends AbstractGatewayFilterFactory<AuthenticationFilterinig.Config>{

    private final WebClient.Builder webclientBuilder;
    
    private static final Logger log = LoggerFactory.getLogger(AuthenticationFilterinig.class);

    public AuthenticationFilterinig(WebClient.Builder _webClientBuilder) {
        super(AuthenticationFilterinig.Config.class);
        this.webclientBuilder = _webClientBuilder;
    }
    
    @Override
    public GatewayFilter apply(Config config) {
        log.info("Global GatewayFilter Filtering Executed");
               return new OrderedGatewayFilter((exchange, chain) -> {  
             if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                        log.info("Error de Header");  
                        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing  Authorization header");
             }
             
             
             String authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
                    String[] parts = authHeader.split(" ");
                    if (parts.length != 2 || !"Bearer".equals(parts[0])) {
                        log.info("Error de Bearer");  
                        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Bad Authorization structure");
                    }                      
                    
                    return  webclientBuilder.build()
                            .get()
                            .uri("http://KEYCLOAKADAPTER/roles").header(HttpHeaders.AUTHORIZATION, parts[1])                           
                            .retrieve()
                             .bodyToMono(JsonNode.class)
                             .map(response -> {  
                                 if(response != null){
                                     
                                   log.info("See Objects: " + response);  
                                     //check for Partners rol                                 
                                   if(response.get("Partners") == null || StringUtils.isEmpty(response.get("Partners").asText())){
                                        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Role Partners missing");
                                   }
                                 }else{
                                     throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Roles missing");
                                 }
                             return exchange;
                     })
                       .onErrorMap(error -> { throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Communication Error", error.getCause());})
                      .flatMap(chain::filter);                                                     
                },1);   

    }
    
    public static class Config{} 
}
