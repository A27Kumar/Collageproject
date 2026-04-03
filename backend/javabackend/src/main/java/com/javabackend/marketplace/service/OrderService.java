

package com.javabackend.marketplace.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.javabackend.marketplace.config.AuthContext;
import com.javabackend.marketplace.dto.OrderResponse;
import com.javabackend.marketplace.model.Order;
import com.javabackend.marketplace.model.Product;
import com.javabackend.marketplace.repository.OrderRepository;
import com.javabackend.marketplace.repository.ProductRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    // 🔹 Place Order (BUYER only)
    public OrderResponse placeOrder(String productId) {

        String buyerId = AuthContext.getUserId();
        String role = AuthContext.getRole();

        if (buyerId == null) {
            throw new IllegalArgumentException("Unauthorized");
        }

        if (!"BUYER".equalsIgnoreCase(role)) {
            throw new IllegalArgumentException("Only buyers can place orders");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (product.getSellerId().equals(buyerId)) {
            throw new IllegalArgumentException("Seller cannot buy own product");
        }

        Order order = new Order();
        order.setProductId(productId);
        order.setBuyerId(buyerId);
        order.setSellerId(product.getSellerId());
        order.setPrice(product.getPrice());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PLACED");

        return convertToResponse(orderRepository.save(order));
    }

    // 🔹 Confirm Order (SELLER only)
    public OrderResponse confirmOrder(String orderId) {

        String sellerId = AuthContext.getUserId();
        String role = AuthContext.getRole();

        if (sellerId == null) {
            throw new IllegalArgumentException("Unauthorized");
        }

        if (!"SELLER".equalsIgnoreCase(role)) {
            throw new IllegalArgumentException("Only sellers can confirm orders");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (!order.getSellerId().equals(sellerId)) {
            throw new IllegalArgumentException("Not authorized");
        }

        if (!"PLACED".equals(order.getStatus())) {
            throw new IllegalArgumentException("Order cannot be confirmed");
        }

        order.setStatus("CONFIRMED");

        return convertToResponse(orderRepository.save(order));
    }

    // 🔹 Deliver Order (SELLER only) 🔥 NEW
    public OrderResponse deliverOrder(String orderId) {

        String sellerId = AuthContext.getUserId();
        String role = AuthContext.getRole();

        if (sellerId == null) {
            throw new IllegalArgumentException("Unauthorized");
        }

        if (!"SELLER".equalsIgnoreCase(role)) {
            throw new IllegalArgumentException("Only sellers can deliver orders");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (!order.getSellerId().equals(sellerId)) {
            throw new IllegalArgumentException("Not authorized");
        }

        if (!"CONFIRMED".equals(order.getStatus())) {
            throw new IllegalArgumentException("Only confirmed orders can be delivered");
        }

        order.setStatus("DELIVERED");

        return convertToResponse(orderRepository.save(order));
    }

    // 🔹 Cancel Order (BUYER only)
    public OrderResponse cancelOrder(String orderId) {

        String buyerId = AuthContext.getUserId();
        String role = AuthContext.getRole();

        if (buyerId == null) {
            throw new IllegalArgumentException("Unauthorized");
        }

        if (!"BUYER".equalsIgnoreCase(role)) {
            throw new IllegalArgumentException("Only buyers can cancel orders");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (!order.getBuyerId().equals(buyerId)) {
            throw new IllegalArgumentException("Not authorized");
        }

        if (!"PLACED".equals(order.getStatus())) {
            throw new IllegalArgumentException("Order cannot be cancelled");
        }

        order.setStatus("CANCELLED");

        return convertToResponse(orderRepository.save(order));
    }

    // 🔹 Get Orders By Buyer
    public List<OrderResponse> getOrdersByBuyer() {

        String buyerId = AuthContext.getUserId();
        String role = AuthContext.getRole();

        if (!"BUYER".equalsIgnoreCase(role)) {
            throw new IllegalArgumentException("Only buyers can view orders");
        }

        return orderRepository.findByBuyerId(buyerId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // 🔹 Get Orders By Seller
    public List<OrderResponse> getOrdersBySeller() {

        String sellerId = AuthContext.getUserId();
        String role = AuthContext.getRole();

        if (!"SELLER".equalsIgnoreCase(role)) {
            throw new IllegalArgumentException("Only sellers can view orders");
        }

        return orderRepository.findBySellerId(sellerId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // 🔹 Convert Entity → DTO
    private OrderResponse convertToResponse(Order order) {

        Product product = productRepository.findById(order.getProductId())
                .orElse(null);

        String productName = (product != null)
                ? product.getName()
                : "Unknown Product";

        return new OrderResponse(
                order.getId(),
                productName,
                order.getPrice(),
                order.getOrderDate(),
                order.getStatus()
        );
    }
}