package com.javabackend.marketplace.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.javabackend.marketplace.config.AuthContext;
import com.javabackend.marketplace.dto.ProductResponse;
import com.javabackend.marketplace.model.Product;
import com.javabackend.marketplace.model.Review;
import com.javabackend.marketplace.repository.ProductRepository;
import com.javabackend.marketplace.repository.ReviewRepository;


import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // 🔹 Add Product (SELLER only)
    public ProductResponse addProduct(Product product) {

       
        String sellerId = AuthContext.getUserId();
        String role = AuthContext.getRole();

        if (sellerId == null) {
            throw new IllegalArgumentException("Unauthorized");
        }

        if (!"SELLER".equalsIgnoreCase(role)) {
            throw new IllegalArgumentException("Only sellers can add products");
        }

        product.setSellerId(sellerId);
        product.setApproved(false); // New products require admin approval

        Product savedProduct = productRepository.save(product);

       
        return convertToResponse(savedProduct);
    }

    // 🔹 Get All Products
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // 🔹 Get Products By Seller
    public List<ProductResponse> getProductsBySeller(String sellerId) {
        return productRepository.findBySellerId(sellerId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // 🔹 Update Product (Owner SELLER only)
    public ProductResponse updateProduct(String productId, Product updatedProduct) {

        String sellerId = AuthContext.getUserId();
        String role = AuthContext.getRole();

        if (sellerId == null) {
            throw new IllegalArgumentException("Unauthorized");
        }

        if (!"SELLER".equalsIgnoreCase(role)) {
            throw new IllegalArgumentException("Only sellers can update products");
        }

        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (!existingProduct.getSellerId().equals(sellerId)) {
            throw new IllegalArgumentException("You are not authorized to update this product");
        }

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setCategory(updatedProduct.getCategory());

        // 🔥 ADD THIS (important)
        existingProduct.setImageUrl(updatedProduct.getImageUrl());

        Product savedProduct = productRepository.save(existingProduct);

        return convertToResponse(savedProduct);
    }

    // 🔹 Delete Product (Owner SELLER only)
    public void deleteProduct(String productId) {

        String sellerId = AuthContext.getUserId();
        String role = AuthContext.getRole();

        if (sellerId == null) {
            throw new IllegalArgumentException("Unauthorized");
        }

        if (!"SELLER".equalsIgnoreCase(role)) {
            throw new IllegalArgumentException("Only sellers can delete products");
        }

        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (!existingProduct.getSellerId().equals(sellerId)) {
            throw new IllegalArgumentException("You are not authorized to delete this product");
        }

        productRepository.delete(existingProduct);
    }

    // 🔹 Pagination + Category Filter
   public Page<ProductResponse> getProducts(String category, String search, Pageable pageable) {

    Page<Product> productPage;

    if (search != null && !search.isEmpty()) {
        productPage = productRepository.findByNameContainingIgnoreCaseAndApprovedTrue(search, pageable);

    } else if (category != null && !category.isEmpty()) {
        productPage = productRepository.findByCategoryAndApprovedTrue(category, pageable);

    } else {
        productPage = productRepository.findByApprovedTrue(pageable);
    }

    return productPage.map(this::convertToResponse); 
    }
    
    // 🔹 Get Product By ID
    public ProductResponse getProductById(String id) {

        Product product = productRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        return convertToResponse(product);
    }

     @Autowired
     private ReviewRepository reviewRepository;

    // 🔹 Convert Entity → DTO
    private ProductResponse convertToResponse(Product product) {

        //Get Reviews
        List<Review> reviews = reviewRepository.findByProductId(product.getId());
          int totalReviews = reviews.size();
          double avgRating = 0;

          if (!reviews.isEmpty()) {
              avgRating = reviews.stream()
                      .mapToInt(Review::getRating)
                      .average()
                      .orElse(0);
          }

          avgRating = Math.round(avgRating * 10.0) / 10.0; // Round to 1 decimal place

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getCategory(),
                product.getImageUrl(), // 🔥 FINAL FIX
                avgRating, 
                totalReviews,
                product.isApproved()
        );
    }
}
