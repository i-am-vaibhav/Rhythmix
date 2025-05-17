package com.rhythmix.config_server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;

@SpringBootApplication
@EnableConfigServer
public class RhythmixConfigServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(RhythmixConfigServerApplication.class, args);
	}

}