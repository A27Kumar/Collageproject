
package com.javabackend.marketplace.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.javabackend.marketplace.dto.ProductResponse;
import com.javabackend.marketplace.model.Product;
import com.javabackend.marketplace.service.ProductService;
import com.javabackend.marketplace.config.AuthContext;
import com.javabackend.marketplace.repository.ProductRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

   
    // ✅ Add Product
    @PostMapping
    public ProductResponse addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }

    @Autowired
    private MongoTemplate mongoTemplate;
    // ✅ Get Products (Search + Category)
    @GetMapping
    public Page<ProductResponse> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 6) Pageable pageable) {
            
         System.out.println("conntecd db " + mongoTemplate.getDb().getName());

        return productService.getProducts(category, search, pageable);
    }

    // 🔥 FIXED: Seller Products (SECURE)
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

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/seller/notified")
    public List<Product> getNotifications() {
    String sellerId = AuthContext.getUserId();
    return productRepository.findBySellerIdAndApprovedTrueAndNotifiedFalse(sellerId);
    }

    @PutMapping("/seller/notify-read/{id}")
    public void markAsRead(@PathVariable String id) {

    Product product = productRepository.findById(id).orElseThrow();

    product.setNotified(true);
    productRepository.save(product);
    }
}