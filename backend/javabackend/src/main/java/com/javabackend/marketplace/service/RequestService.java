package com.javabackend.marketplace.service;
import com.javabackend.marketplace.model.Product;
import com.javabackend.marketplace.model.Request;
import com.javabackend.marketplace.model.User;
import com.javabackend.marketplace.repository.ProductRepository;
import com.javabackend.marketplace.repository.RequestRepository;
import com.javabackend.marketplace.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.javabackend.marketplace.config.AuthContext;
import com.javabackend.marketplace.dto.ProductResponse;





@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    public Request createRequest(Request request) {

        String userId = AuthContext.getUserId();
        User user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));

        request.setUserId(userId);
        request.setCity(user.getCity());
        request.setCollege(user.getCollege());

        return requestRepository.save(request);
    }

    
    public List<ProductResponse> getMatchingProducts(String requestId) {

    Request request = requestRepository.findById(requestId)
            .orElseThrow(() -> new IllegalArgumentException("Request not found"));

    // 🔥 Better keyword extraction
    String keyword = request.getTitle()
            .replace("Need", "")
            .replace("need", "")
            .trim();

    // 🔥 Find matching products
    List<Product> products = productRepository
            .findByNameContainingIgnoreCase(keyword);

    return products.stream()
            .filter(Product::isApproved)
            .distinct()
            .map(productService::convertToResponse)
            .toList();
    }

    public List<Request> getNearbyRequests(String city, String college) {

    List<Request> result = new ArrayList<>();

    if (college != null && !college.isEmpty()) {
        result.addAll(
            requestRepository.findByCollegeContainingIgnoreCase(college)
        );
    }

    if (city != null && !city.isEmpty()) {
        result.addAll(
            requestRepository.findByCityContainingIgnoreCase(city)
        );
    }

    return result.stream().distinct().toList();
   }
}