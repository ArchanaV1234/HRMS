package com.excelr.controller;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenUtil {

    // Generate a secure random key suitable for HS512
    private final SecretKey JWT_SECRET = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    private final long JWT_EXPIRATION = 86400000;  // 1 day

    public String generateToken(Authentication authentication) {
        User userPrincipal = (User) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + JWT_EXPIRATION))
                .signWith(JWT_SECRET, SignatureAlgorithm.HS512)  // Use secure key
                .compact();
    }
}
