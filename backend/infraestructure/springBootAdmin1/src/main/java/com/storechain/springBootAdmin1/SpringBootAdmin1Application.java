package com.storechain.springBootAdmin1;

import de.codecentric.boot.admin.server.config.EnableAdminServer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@EnableDiscoveryClient
@Configuration
@EnableAdminServer
@SpringBootApplication
public class SpringBootAdmin1Application {

	public static void main(String[] args) {
		SpringApplication.run(SpringBootAdmin1Application.class, args);
	}

}
