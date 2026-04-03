
// package com.example.demo.controller;

// import com.example.demo.dto.OrderResponse;
// import com.example.demo.service.OrderService;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/orders")
// public class OrderController {

//     @Autowired
//     private OrderService orderService;

//     @PostMapping
//     public OrderResponse placeOrder(
//             @RequestParam String productId,
//             @RequestParam String buyerId) {

//         return orderService.placeOrder(productId, buyerId);
//     }

//     @GetMapping("/buyer/{buyerId}")
//     public List<OrderResponse> getOrdersByBuyer(@PathVariable String buyerId) {
//         return orderService.getOrdersByBuyer(buyerId);
//     }

//     @GetMapping("/seller/{sellerId}")
//     public List<OrderResponse> getOrdersBySeller(@PathVariable String sellerId) {
//         return orderService.getOrdersBySeller(sellerId);
//     }

//     @PutMapping("/confirm/{orderId}")
//     public OrderResponse confirmOrder(
//         @PathVariable String orderId,
//         @RequestParam String sellerId) {

//          return orderService.confirmOrder(orderId, sellerId);
//     }

//     @PutMapping("/cancel/{orderId}")
//     public OrderResponse cancelOrder(
//         @PathVariable String orderId,
//         @RequestParam String buyerId) {

//         return orderService.cancelOrder(orderId, buyerId);
//     }

// }

package com.javabackend.marketplace.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.javabackend.marketplace.dto.OrderResponse;
import com.javabackend.marketplace.service.OrderService;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/{productId}")
    public OrderResponse placeOrder(@PathVariable String productId) {
        return orderService.placeOrder(productId);
    }

    @PutMapping("/confirm/{orderId}")
    public OrderResponse confirmOrder(@PathVariable String orderId) {
        return orderService.confirmOrder(orderId);
    }

    @PutMapping("/cancel/{orderId}")
    public OrderResponse cancelOrder(@PathVariable String orderId) {
        return orderService.cancelOrder(orderId);
    }

    @GetMapping("/buyer")
    public List<OrderResponse> getOrdersByBuyer() {
        return orderService.getOrdersByBuyer();
    }

    @GetMapping("/seller")
    public List<OrderResponse> getOrdersBySeller() {
        return orderService.getOrdersBySeller();
    }

    @PutMapping("/deliver/{orderId}")
    public OrderResponse deliverOrder(@PathVariable String orderId) {
        return orderService.deliverOrder(orderId);
    }
}