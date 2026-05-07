
package com.javabackend.marketplace.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import com.javabackend.marketplace.dto.ProductResponse;
import com.javabackend.marketplace.model.Product;
import com.javabackend.marketplace.service.ProductService;

import lombok.RequiredArgsConstructor;

import com.javabackend.marketplace.config.AuthContext;
import com.javabackend.marketplace.repository.ProductRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    // ✅ Add Product
    @PostMapping
    public ProductResponse addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }

    // ✅ UPDATED FILTER API
    @GetMapping
    public Page<ProductResponse> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String college,
            @PageableDefault(size = 6) Pageable pageable) {

        return productService.getProducts(
                category, search, minPrice, maxPrice, minRating, sortBy, city, college, pageable
        );
    }

    // ✅ Seller Products
    @GetMapping("/seller")
    public List<ProductResponse> getSellerProducts() {
        String sellerId = AuthContext.getUserId();
        return productService.getProductsBySeller(sellerId);
    }

    // ✅ Update Product
    @PutMapping("/{productId}")
    public ProductResponse updateProduct(
            @PathVariable String productId,
            @RequestBody Product product) {

        return productService.updateProduct(productId, product);
    }

    // ✅ Delete Product
    @DeleteMapping("/{productId}")
    public String deleteProduct(@PathVariable String productId) {
        productService.deleteProduct(productId);
        return "Product deleted successfully";
    }

    // ✅ Get Product by ID
    @GetMapping("/details/{id}")
    public ProductResponse getProductById(@PathVariable String id) {
        return productService.getProductById(id);
    }

    // 🔥 GET NOTIFICATIONS (FIXED NAME)
    @GetMapping("/seller/notifications")
    public List<Product> getNotifications() {
        String sellerId = AuthContext.getUserId();
        return productRepository
                .findBySellerIdAndApprovedTrueAndNotifiedFalse(sellerId);
    }

    //City
    // 🔥 2.1 Nearby Products API
    @GetMapping("/nearby")
     public Map<String, List<ProductResponse>> getNearbyProducts(
        @RequestParam String city,
        @RequestParam String college) {

    // 🔥 College products
    List<ProductResponse> collegeProducts = productRepository
            .findByCollegeContainingIgnoreCase(college)
            .stream()
            .filter(Product::isApproved)
            .map(productService::convertToResponse)
            .toList();

    // 🔥 City products
    List<ProductResponse> cityProducts = productRepository
            .findByCityContainingIgnoreCase(city)
            .stream()
            .filter(Product::isApproved)
            .map(productService::convertToResponse)
            .toList();

    Map<String, List<ProductResponse>> result = new HashMap<>();

    result.put("college", collegeProducts);
    result.put("city", cityProducts);

    return result;
    }


     

    // 🔥 MARK AS READ (SECURE)
    @PutMapping("/seller/notify-read/{id}")
    public void markAsRead(@PathVariable String id) {

        String sellerId = AuthContext.getUserId();

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (!product.getSellerId().equals(sellerId)) {
            throw new IllegalArgumentException("Not authorized");
        }

        product.setNotified(true);
        productRepository.save(product);
    }
}