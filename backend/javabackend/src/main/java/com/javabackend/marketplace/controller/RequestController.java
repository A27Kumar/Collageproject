package com.javabackend.marketplace.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.javabackend.marketplace.dto.ProductResponse;
import com.javabackend.marketplace.model.Request;
import com.javabackend.marketplace.service.RequestService;
import java.util.List;

@RestController
@RequestMapping("/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @PostMapping
    public Request create(@RequestBody Request request) {
        return requestService.createRequest(request);
    }

    @GetMapping("/nearby")
    public List<Request> nearby(
            @RequestParam String city,
            @RequestParam String college) {

        return requestService.getNearbyRequests(city, college);
    }

    @GetMapping("/{requestId}/matches")
    public List<ProductResponse> getMatchingProducts(@PathVariable String requestId) {
    return requestService.getMatchingProducts(requestId);
}
}