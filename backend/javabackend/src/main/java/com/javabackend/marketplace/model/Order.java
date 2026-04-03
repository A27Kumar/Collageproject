
package com.javabackend.marketplace.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    private String productId;
    private String buyerId;
    private String sellerId;
    private double price;
    private LocalDateTime orderDate;
    private String status;

    public Order() {}

    public Order(String productId, String buyerId, String sellerId, double price, LocalDateTime orderDate, String status) {
        this.productId = productId;
        this.buyerId = buyerId;
        this.sellerId = sellerId;
        this.price = price;
        this.orderDate = orderDate;
        this.status = status;
    }

    public String getId() { return id; }
    public String getProductId() { return productId; }
    public String getBuyerId() { return buyerId; }
    public String getSellerId() { return sellerId; }
    public double getPrice() { return price; }
    public LocalDateTime getOrderDate() { return orderDate; }
    public String getStatus() { return status; }

    public void setStatus(String status) { this.status = status; }
    public void setId(String id) { this.id = id; }
    public void setProductId(String productId) { this.productId = productId; }
    public void setBuyerId(String buyerId) { this.buyerId = buyerId; }
    public void setSellerId(String sellerId) { this.sellerId = sellerId; }
    public void setPrice(double price) { this.price = price; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }
}