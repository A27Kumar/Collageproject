package com.javabackend.marketplace.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.javabackend.marketplace.config.AuthContext;
import com.javabackend.marketplace.dto.ReviewResponse;
import com.javabackend.marketplace.model.Product;
import com.javabackend.marketplace.model.Review;
import com.javabackend.marketplace.repository.OrderRepository;
import com.javabackend.marketplace.repository.ProductRepository;
import com.javabackend.marketplace.repository.ReviewRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    // ✅ ADD REVIEW
    public ReviewResponse addReview(String productId, int rating, String comment) {

        String userId = AuthContext.getUserId();

        if (userId == null) {
            throw new IllegalArgumentException("Unauthorized");
        }

        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        // ❌ Seller cannot review
        if (product.getSellerId().equals(userId)) {
            throw new IllegalArgumentException("You cannot review your own product");
        }

        // ❌ Duplicate review
        if (reviewRepository.existsByProductIdAndUserId(productId, userId)) {
            throw new IllegalArgumentException("You already reviewed this product");
        }

        // ❌ Fake review (must purchase)
        boolean hasPurchased = orderRepository
                .existsByProductIdAndBuyerIdAndStatusIn(
                        productId,
                        userId,
                        List.of("CONFIRMED", "DELIVERED")
                );

        if (!hasPurchased) {
            throw new IllegalArgumentException("You must purchase before reviewing");
        }

        Review review = new Review();
        review.setProductId(productId);
        review.setUserId(userId);
        review.setRating(rating);
        review.setComment(comment);
        review.setVerified(true);
        review.setCreatedAt(LocalDateTime.now());
        review.setLikes(0);

        return convert(reviewRepository.save(review));
    }

    // ✅ GET REVIEWS (WITH SORT)
    public List<ReviewResponse> getReviews(String productId, String sort) {

        List<Review> reviews = reviewRepository.findByProductId(productId);

        if ("top".equalsIgnoreCase(sort)) {
            reviews.sort((a, b) -> Integer.compare(b.getRating(), a.getRating()));

        } else if ("liked".equalsIgnoreCase(sort)) {
            reviews.sort((a, b) -> Integer.compare(b.getLikes(), a.getLikes()));

        } else {
            // default → latest
            reviews.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        }

        return reviews.stream()
                .map(this::convert)
                .toList();
    }

    // ✅ UPDATE REVIEW
    public ReviewResponse updateReview(String reviewId, int rating, String comment) {

        String userId = AuthContext.getUserId();

        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        Review review = reviewRepository.findByIdAndUserId(reviewId, userId);

        if (review == null) {
            throw new IllegalArgumentException("Not authorized");
        }

        review.setRating(rating);
        review.setComment(comment);
        review.setUpdatedAt(LocalDateTime.now());

        return convert(reviewRepository.save(review));
    }

    // ✅ DELETE REVIEW
    public void deleteReview(String reviewId) {

        String userId = AuthContext.getUserId();

        Review review = reviewRepository.findByIdAndUserId(reviewId, userId);

        if (review == null) {
            throw new IllegalArgumentException("Not authorized");
        }

        reviewRepository.delete(review);
    }

    // ✅ LIKE REVIEW
    public void likeReview(String reviewId) {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        review.setLikes(review.getLikes() + 1);

        reviewRepository.save(review);
    }

    // ✅ SELLER REPLY
    public ReviewResponse replyToReview(String reviewId, String reply) {

        String sellerId = AuthContext.getUserId();
        String role = AuthContext.getRole();

        if (!"SELLER".equalsIgnoreCase(role)) {
            throw new IllegalArgumentException("Only seller can reply");
        }

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        Product product = productRepository.findById(review.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        // ❌ Only product owner can reply
        if (!product.getSellerId().equals(sellerId)) {
            throw new IllegalArgumentException("Not your product");
        }

        review.setSellerReply(reply);
        review.setReplyAt(LocalDateTime.now());

        return convert(reviewRepository.save(review));
    }

    // 🔄 CONVERT ENTITY → DTO
    private ReviewResponse convert(Review r) {
        return new ReviewResponse(
                r.getId(),
                r.getRating(),
                r.getComment(),
                r.getCreatedAt(),
                r.isVerified(),
                r.getLikes(),
                r.getUserId(),          // 🔥 IMPORTANT
                r.getSellerReply(),     // 🔥 NEW
                r.getReplyAt()          // 🔥 NEW
        );
    }
}