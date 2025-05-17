package com.rhythmix.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@SpringBootApplication
public class RhythmixGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(RhythmixGatewayApplication.class, args);
	}

}
