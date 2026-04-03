

package com.javabackend.marketplace.dto;

import java.time.LocalDateTime;

public class OrderResponse {

    private String id;
    private String productName;
    private double price;
    private LocalDateTime orderDate;
    private String status;

    public OrderResponse(String id, String productName, double price, LocalDateTime orderDate, String status) {
        this.id = id;
        this.productName = productName;
        this.price = price;
        this.orderDate = orderDate;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public String getProductName() {
        return productName;
    }

    public double getPrice() {
        return price;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public String getStatus() {
        return status;
    }
}