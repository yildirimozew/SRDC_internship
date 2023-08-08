package com.yildirim.messageapp;

import org.apache.commons.lang3.ArrayUtils;

public class TokenStorage {
  private static String[] tokens;

  public static boolean findInTokens(String token) {
    return ArrayUtils.contains(tokens, token);
  }

  public static void addToken(String token) {
    tokens = ArrayUtils.add(tokens, token);
  }

  public static void removeToken(String token) {
    tokens = ArrayUtils.removeElement(tokens, token);
  }
}
