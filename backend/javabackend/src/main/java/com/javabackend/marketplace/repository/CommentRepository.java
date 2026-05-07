package com.javabackend.marketplace.repository;

import com.javabackend.marketplace.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository
        extends MongoRepository<Comment, String> {

    List<Comment> findByPostId(String postId);

    List<Comment> findByParentCommentId(String parentCommentId);
}