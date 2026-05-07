package com.javabackend.marketplace.dto;

import com.javabackend.marketplace.dto.ProductResponse;
import com.javabackend.marketplace.model.Request;
import com.javabackend.marketplace.model.CommunityPost;

import lombok.Data;

import java.util.List;

@Data
public class GlobalSearchResponse {

    private List<ProductResponse> products;

    private List<Request> requests;

    private List<CommunityPost> posts;
}
