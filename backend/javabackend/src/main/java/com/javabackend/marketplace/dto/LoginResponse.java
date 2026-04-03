
package com.javabackend.marketplace.dto;

public class LoginResponse {

    private String message;
    private String userId;

    public LoginResponse(String message, String userId) {
        this.message = message;
        this.userId = userId;
    }

    public String getMessage() { return message; }
    public String getUserId() { return userId; }
}