package com.rhythmix.auth_service.config;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class CustomPasswordEncoder {

    private final PasswordEncoder passwordEncoder;

    public CustomPasswordEncoder() {
        this.passwordEncoder = new BCryptPasswordEncoder(BCryptPasswordEncoder.BCryptVersion.$2Y);
    }

    public boolean matches(String userPassword, String systemPassword){
        return passwordEncoder.matches(userPassword,systemPassword);
    }

    public String hash(String userPassword){
        return passwordEncoder.encode(userPassword);
    }

}
