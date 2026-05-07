package com.javabackend.marketplace.controller;

import com.javabackend.marketplace.dto.GlobalSearchResponse;
import com.javabackend.marketplace.service.SearchService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/search")
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping("/global")
    public GlobalSearchResponse search(
            @RequestParam String query) {

        return searchService.globalSearch(query);
    }
}