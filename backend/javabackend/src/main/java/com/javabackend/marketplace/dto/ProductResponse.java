package com.javabackend.marketplace.dto;

public class ProductResponse {

    private String id;
    private String imageUrl;
    private String name;
    private String description;
    private double price;
    private String category;

    private double avgRating;
    private int totalReviews;

    private boolean approved;

    public ProductResponse(
            String id,
            String name,
            String description,
            double price,
            String category,
            String imageUrl,
            double avgRating,
            int totalReviews,
            boolean approved
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.imageUrl = imageUrl;
        this.avgRating = avgRating;
        this.totalReviews = totalReviews;
        this.approved = approved;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getImageUrl() { return imageUrl; }
    public String getDescription() { return description; }
    public double getPrice() { return price; }
    public String getCategory() { return category; }

    public double getAvgRating() { return avgRating; }
    public int getTotalReviews() { return totalReviews; }
    public boolean isApproved() { return approved; }
}