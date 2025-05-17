package com.rhythmix.auth_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@SpringBootApplication
public class RhythmixAuthServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(RhythmixAuthServiceApplication.class, args);
	}

}
