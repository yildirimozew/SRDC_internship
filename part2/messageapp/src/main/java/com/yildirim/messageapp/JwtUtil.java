package com.yildirim.messageapp;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;

public class JwtUtil {
  private static final String SECRET_KEY = "EPG5EWrmWJTlOu9FuN6xRvDwqw0tyWpxNAWtK5UmIHE=";

  public static String generateToken(String username, String password, boolean isAdmin) {
    Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    String token = Jwts.builder()
        .claim("username", username)
        .claim("password", password)
        .claim("isAdmin", isAdmin)
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();

    return token;
  }

  public static ReturnClass getFromToken(String token) {
    try {
      Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

      Claims claims = Jwts.parserBuilder()
          .setSigningKey(key)
          .build()
          .parseClaimsJws(token)
          .getBody();

      ReturnClass returnClass = new ReturnClass(claims.get("username", String.class),
          claims.get("password", String.class), claims.get("isAdmin", Boolean.class));
      return returnClass;
    } catch (Exception e) {
      return null;
    }
  }
}