package com.javabackend.marketplace.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.javabackend.marketplace.dto.ReviewResponse;
import com.javabackend.marketplace.service.ReviewService;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // ✅ ADD
    @PostMapping("/{productId}")
    public ReviewResponse addReview(
            @PathVariable String productId,
            @RequestParam int rating,
            @RequestParam String comment) {

        return reviewService.addReview(productId, rating, comment);
    }

    // ✅ GET
    @GetMapping("/{productId}")
    public List<ReviewResponse> getReviews(
          @PathVariable String productId,
          @RequestParam(defaultValue = "latest") String sort) {

        return reviewService.getReviews(productId, sort);
   }

    // ✅ UPDATE
    @PutMapping("/{reviewId}")
    public ReviewResponse update(
            @PathVariable String reviewId,
            @RequestParam int rating,
            @RequestParam String comment) {

        return reviewService.updateReview(reviewId, rating, comment);
    }

    // ✅ DELETE
    @DeleteMapping("/{reviewId}")
    public String delete(@PathVariable String reviewId) {
        reviewService.deleteReview(reviewId);
        return "Deleted successfully";
    }

    // ✅ LIKE
    @PutMapping("/like/{reviewId}")
    public String like(@PathVariable String reviewId) {
        reviewService.likeReview(reviewId);
        return "Liked";
    }

    // ✅ SELLER REPLY
    @PutMapping("/reply/{reviewId}")
     public ReviewResponse reply(
          @PathVariable String reviewId,
          @RequestParam String reply) {
       return reviewService.replyToReview(reviewId, reply);
    }
}