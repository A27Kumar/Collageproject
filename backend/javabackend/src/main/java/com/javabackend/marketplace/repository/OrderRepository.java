

package com.javabackend.marketplace.repository;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.javabackend.marketplace.model.Order;

public interface OrderRepository extends MongoRepository<Order, String> {

List<Order> findByBuyerId(String buyerId);
List<Order> findBySellerId(String sellerId);
boolean existsByProductIdAndBuyerIdAndStatusIn(String productId, String buyerId, List<String> statuses);
}