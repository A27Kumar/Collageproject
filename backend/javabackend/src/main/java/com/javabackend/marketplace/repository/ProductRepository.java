package com.javabackend.marketplace.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.javabackend.marketplace.model.Product;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductRepository extends MongoRepository<Product, String> {

    List<Product> findBySellerId(String sellerId);

    Page<Product> findByCategory(String category, Pageable pageable);

    // 🔥 ADD THESE
    List<Product> findByNameContainingIgnoreCase(String name);

    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

    List<Product> findByApprovedFalse();
    List<Product> findByApprovedTrue();

    Page<Product> findByApprovedTrue(Pageable pageable);

    Page<Product> findByCategoryAndApprovedTrue(String category, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndApprovedTrue(String name, Pageable pageable);

    List<Product> findBySellerIdAndApprovedTrueAndNotifiedFalse(String sellerId);
}
