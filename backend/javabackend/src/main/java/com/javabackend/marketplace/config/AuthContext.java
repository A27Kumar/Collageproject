
package com.javabackend.marketplace.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AuthContext {

    private static HttpServletRequest request;

    @Autowired
    public AuthContext(HttpServletRequest request) {
        AuthContext.request = request;
    }

    public static String getUserId() {
        return (String) request.getAttribute("userId");
    }

    public static String getRole() {
        return (String) request.getAttribute("role");
    }
}