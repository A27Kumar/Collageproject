package com.javabackend.marketplace.service;

import com.javabackend.marketplace.dto.GlobalSearchResponse;
import com.javabackend.marketplace.dto.ProductResponse;
import com.javabackend.marketplace.model.Product;
import com.javabackend.marketplace.repository.ProductRepository;
import com.javabackend.marketplace.repository.RequestRepository;
import com.javabackend.marketplace.repository.CommunityPostRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private CommunityPostRepository communityPostRepository;

    @Autowired
    private ProductService productService;

    public GlobalSearchResponse globalSearch(String query) {

        // 🔥 Products
        List<ProductResponse> products = productRepository
                .findByNameContainingIgnoreCase(query)
                .stream()
                .filter(Product::isApproved)
                .map(productService::convertToResponse)
                .toList();

        // 🔥 Requests
        var requests = requestRepository
                .findByTitleContainingIgnoreCase(query);

        // 🔥 Community posts
        var posts = communityPostRepository
                .findByTitleContainingIgnoreCase(query);

        GlobalSearchResponse response =
                new GlobalSearchResponse();

        response.setProducts(products);
        response.setRequests(requests);
        response.setPosts(posts);

        return response;
    }
}