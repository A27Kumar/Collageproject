package com.javabackend.marketplace.controller;
import com.javabackend.marketplace.config.AuthContext;
import com.javabackend.marketplace.dto.AdminStats;
import com.javabackend.marketplace.model.Order;
import com.javabackend.marketplace.model.Product;
import com.javabackend.marketplace.model.User;
import com.javabackend.marketplace.repository.OrderRepository;
import com.javabackend.marketplace.repository.ProductRepository;
import com.javabackend.marketplace.repository.ReviewRepository;
import com.javabackend.marketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private OrderRepository orderRepository;

    // ✅ USERS
    @GetMapping("/users")
    public List<User> getUsers() {
        checkAdmin();
        return userRepository.findAll();
    }

    // ✅ DELETE USER
    @DeleteMapping("/user/{id}")
    public String deleteUser(@PathVariable String id) {
        checkAdmin();
        userRepository.deleteById(id);
        return "User deleted";
    }

    // ✅ BAN USER
    @PutMapping("/ban/{id}")
    public String banUser(@PathVariable String id) {
     checkAdmin();

      User user = userRepository.findById(id).orElseThrow();
      user.setBanned(true);
      userRepository.save(user);

      return "User banned";
    }

    @PutMapping("/unban/{id}")
    public String unbanUser(@PathVariable String id) {
     checkAdmin();

      User user = userRepository.findById(id).orElseThrow();
      user.setBanned(false);
      userRepository.save(user);

      return "User unbanned";
    }
    
    @PutMapping("/approve/{id}")
    public String approveProduct(@PathVariable String id) {
     checkAdmin();

       Product product = productRepository.findById(id).orElseThrow();
       product.setApproved(true);
       product.setNotified(false); // Reset notification flag
       productRepository.save(product);

       return "Product approved";
    }

    @GetMapping("/pending-products")
    public List<Product> getPendingProducts() {
     checkAdmin();
      return productRepository.findByApprovedFalse();
   }

    @GetMapping("/stats")
    public AdminStats getStats() {

    checkAdmin();

    long users = userRepository.count();
    long products = productRepository.count();
    long orders = orderRepository.count();

    double revenue = orderRepository.findAll()
            .stream()
            .filter(o -> "CONFIRMED".equals(o.getStatus()))
            .mapToDouble(Order::getPrice)
            .sum();

    return new AdminStats(users, products, orders, revenue);
    }

    // ✅ PRODUCTS
    @GetMapping("/products")
    public List<Product> getProducts() {
        checkAdmin();
        return productRepository.findAll();
    }

    @DeleteMapping("/product/{id}")
    public String deleteProduct(@PathVariable String id) {
        checkAdmin();
        productRepository.deleteById(id);
        return "Product removed";
    }

    // ✅ REVIEWS
    @DeleteMapping("/review/{id}")
    public String deleteReview(@PathVariable String id) {
        checkAdmin();
        reviewRepository.deleteById(id);
        return "Review removed";
    }

    // ✅ ORDERS
    @GetMapping("/orders")
    public List<Order> getOrders() {
        checkAdmin();
        return orderRepository.findAll();
    }

    private void checkAdmin() {
        String role = AuthContext.getRole();

         if (!"ADMIN".equalsIgnoreCase(role)) {
             throw new IllegalArgumentException("Unauthorized");
         }
    }
}