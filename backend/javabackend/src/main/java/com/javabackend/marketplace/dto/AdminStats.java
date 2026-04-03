package com.javabackend.marketplace.dto;



import lombok.Data;

@Data


public class AdminStats {
    private long users;
    private long products;
    private long orders;
    private double revenue;

    public AdminStats(long users, long products, long orders, double revenue) {
        this.users = users;
        this.products = products;
        this.orders = orders;
        this.revenue = revenue;
    }

    // getters
}