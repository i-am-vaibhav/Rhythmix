package com.rhythmix.auth_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtils {

    private final String SECRET = "p2sXb8Gq9TX3xkCjcPT8vStE5cVKpEk0FMCB8gpt3hU="; // 32+ chars!
    private SecretKey secretKey;

    private final long EXPIRATION = 3600 * 1000;

    @PostConstruct
    public void init() {
        // Generate SecretKey once from the secret string
        this.secretKey = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(secretKey) // Automatically uses HS256
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token, String userName) {
        try {
            final String username = extractUsername(token);
            return username.equals(userName) && !isTokenExpired(token);
        } catch (JwtException e) {
            throw new JwtException("Expired/Invalid token");
        }
    }
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = (Claims) Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token); // Throws if invalid
            return claims.getExpiration().before(new Date());
        } catch (JwtException e) {
            return false;
        }
    }
}

