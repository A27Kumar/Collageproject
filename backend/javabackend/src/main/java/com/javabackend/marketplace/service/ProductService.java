package com.javabackend.marketplace.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.javabackend.marketplace.config.AuthContext;
import com.javabackend.marketplace.dto.ProductResponse;
import com.javabackend.marketplace.model.Product;
import com.javabackend.marketplace.model.Review;
import com.javabackend.marketplace.repository.ProductRepository;
import com.javabackend.marketplace.repository.ReviewRepository;
import com.javabackend.marketplace.model.User;
import com.javabackend.marketplace.repository.UserRepository;


import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

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

// 🔥 ADD THIS BLOCK (MOST IMPORTANT)
        User user = userRepository.findById(sellerId)
           .orElseThrow(() -> new IllegalArgumentException("User not found"));

           product.setCity(user.getCity());
           product.setCollege(user.getCollege());

        product.setApproved(false);

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
  public Page<ProductResponse> getProducts(
        String category,
        String search,
        Double minPrice,
        Double maxPrice,
        Double minRating,
        String sortBy,
        String city,
        String college,
        Pageable pageable) {

    Page<Product> productPage;

    if (college != null && !college.isEmpty()) {
    if (search != null && !search.isEmpty()) {
        productPage = productRepository
                .findByApprovedTrueAndCollegeIgnoreCaseAndNameContainingIgnoreCase(
                        college, search, pageable);
    } else {
        productPage = productRepository
                .findByApprovedTrueAndCollegeIgnoreCase(college, pageable);
    }

    } else if (city != null && !city.isEmpty()) {
    if (search != null && !search.isEmpty()) {
        productPage = productRepository
                .findByApprovedTrueAndCityIgnoreCaseAndNameContainingIgnoreCase(
                        city, search, pageable);
    } else {
        productPage = productRepository
                .findByApprovedTrueAndCityIgnoreCase(city, pageable);
    }

    } else {
    productPage = productRepository.findByApprovedTrue(pageable);
    }

    List<Product> products = productPage.getContent();
    // 🔥 STEP 3: Convert to DTO
    List<ProductResponse> list = products.stream()
            .map(this::convertToResponse)
            .toList();

    // 🔥 STEP 4: Apply Filters
    List<ProductResponse> filtered = list.stream()

            // Category
            .filter(p -> category == null || category.isEmpty()
                    || p.getCategory().equalsIgnoreCase(category))

            // Search
            .filter(p -> search == null || search.isEmpty()
                    || p.getName().toLowerCase().contains(search.toLowerCase()))

            // Price
            .filter(p -> minPrice == null || p.getPrice() >= minPrice)
            .filter(p -> maxPrice == null || p.getPrice() <= maxPrice)

            // Rating
            .filter(p -> minRating == null || p.getAvgRating() >= minRating)

            .toList();

    // 🔥 STEP 5: Sorting
    if ("priceLow".equals(sortBy)) {
        filtered = filtered.stream()
                .sorted((a, b) -> Double.compare(a.getPrice(), b.getPrice()))
                .toList();

    } else if ("priceHigh".equals(sortBy)) {
        filtered = filtered.stream()
                .sorted((a, b) -> Double.compare(b.getPrice(), a.getPrice()))
                .toList();

    } else if ("rating".equals(sortBy)) {
        filtered = filtered.stream()
                .sorted((a, b) -> Double.compare(b.getAvgRating(), a.getAvgRating()))
                .toList();
    }

    // 🔥 STEP 6: Pagination (manual)
    int start = (int) pageable.getOffset();
    int end = Math.min(start + pageable.getPageSize(), filtered.size());

    List<ProductResponse> pageContent =
            (start > filtered.size()) ? List.of() : filtered.subList(start, end);

    return new PageImpl<>(filtered, pageable, productPage.getTotalElements());
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
    public ProductResponse convertToResponse(Product product) {

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
