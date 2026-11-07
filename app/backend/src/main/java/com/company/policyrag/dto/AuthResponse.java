package com.company.policyrag.dto;

public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private String refreshToken;
    private long expiresIn;
    private UserProfileDto user;
    private String message;

    public AuthResponse() {}

    public AuthResponse(String token, UserProfileDto user, String message) {
        this(token, null, 0, user, message);
    }

    public AuthResponse(String token, String refreshToken, long expiresIn, UserProfileDto user, String message) {
        this.token = token;
        this.tokenType = "Bearer";
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
        this.user = user;
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public UserProfileDto getUser() {
        return user;
    }

    public void setUser(UserProfileDto user) {
        this.user = user;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
